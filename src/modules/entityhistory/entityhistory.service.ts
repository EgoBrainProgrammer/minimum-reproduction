import { Inject } from '@nestjs/common';
import { ENTITYEDIT_REPOSITORY, ENTITYHISTORY_REPOSITORY } from 'src/core/constants';
import { EntityHistory } from './entityhistory.entity';
import { Model } from 'sequelize-typescript';
import { EntityEdit } from './entityedit.entity';
import { InstanceUpdateOptions, Op } from 'sequelize';

export class EntityhistoryService {
    constructor(@Inject(ENTITYHISTORY_REPOSITORY) private readonly entityHistoryRepository: typeof EntityHistory,
    @Inject(ENTITYEDIT_REPOSITORY) private readonly entityEditRepository: typeof EntityEdit) {}

    static async create<M extends Model>(user, entity: M, historyId: number = null) {           
        //--Заранее копировать _previousDataValues, так как они мутируют при вызове репозитория--
        const previousDataValues = JSON.parse(JSON.stringify(entity["_previousDataValues"]));
        const changed = entity.changed();
        if(Array.isArray(changed)) {
            let history = await EntityHistory.findByPk(historyId);
            if(!history)
                history = await EntityHistory.create({
                    entity: entity.constructor.name,
                    rowId: entity.id,
                    userId: user && user.hasOwnProperty("id") ? user.id : null
                });
            
            for(let i = 0; i < changed.length; ++i)
                await EntityEdit.create({
                    entityHistoryId: history.id,
                    fieldName: changed[i],
                    oldData: String(previousDataValues[changed[i]]),
                    newData: String(entity.getDataValue(changed[i]))
                });
        }
    }

    static async updateAndCreate<M extends Model>(user, update, entity: M, options: InstanceUpdateOptions = {}, historyId: number = null) {
        await (new Promise<void>(resolve => {
            entity.update(update, options).then(() => resolve()).catch(() => resolve());
            this.create(user, entity, historyId);
        }));
    }

    async createManual<M extends Model>(user, entity: M, data: object, historyId: number = null, checkArrsFields: boolean = false) {
        let history = await this.entityHistoryRepository.findByPk(historyId);
        const historyEdits = [];
        const keys = Object.keys(data);

        for(let i = 0; i < keys.length; ++i) {
            let createHistoryEdit = true;
            let oldData = data[keys[i]]["oldValue"];
            let newData = data[keys[i]]["newValue"];

            //--Не записывать историю, если нет новых связей сущностей--
            //--(по сути таблица многие ко многим не менялась и атрибут ссылающийся на множество внешних объектов остался прежним)--
            if(checkArrsFields && Array.isArray(oldData) && Array.isArray(newData)) {
                createHistoryEdit = false;
                for(let i = 0; i < newData.length; ++i)
                    if(oldData.findIndex(vl =>
                        vl.hasOwnProperty("id") && newData[i].hasOwnProperty("id") && vl["id"] == newData[i]["id"]) == -1) {
                            createHistoryEdit = true;
                            oldData = JSON.stringify(oldData);
                            newData = JSON.stringify(newData);
                            break;
                        }
            }

            if(createHistoryEdit)
                historyEdits.push({
                    fieldName: keys[i],
                    oldData: String(oldData),
                    newData: String(newData)
                });
        }

        if(historyEdits.length > 0) {
            if(!history)
                history = await this.entityHistoryRepository.create({
                    entity: entity.constructor.name,
                    rowId: entity.id,
                    userId: user && user.hasOwnProperty("id") ? user.id : null
                });

            for(let i = 0; i < historyEdits.length; ++i)
                await this.entityEditRepository.create({                    
                    entityHistoryId: history.id,
                    ...historyEdits[i]
                });
        }

        return history;
    }

    //--Метод для обновления объекта по всем видам атрибутов (простые и связи) и одновременным созданием истории--
    //--Возвращает обновленный объект--
    // async createUniversal<M extends Model>(user, entity: M, dto, historyData = {}, include = [], checkArrsFields = true) {
    //     let historyId = null;        
    //     if(Object.keys(historyData).length > 0)
    //         historyId = await this.createManual(user, entity, historyData, null, checkArrsFields);

    //     await this.updateAndCreate(user, dto, entity, {}, historyId ? historyId.id : null);

    //     return { ...(await entity.sequelize.model(entity.constructor.name).findByPk(entity.id, { include })).toJSON(),
    //         changedAttrs: [...new Set((await this.findAllEdits(entity.constructor.name, entity.id)).
    //             filter(val => val.oldData != "null").map(val => val.fieldName))] };
    // }

    async findOne(entity: string, rowId: number) {
        return await this.entityHistoryRepository.findOne({
            where: {
                entity,
                rowId
            },
            include: [
                EntityHistory.associations.edits
            ],
            order: [
                [EntityHistory.associations.edits, 'id', 'ASC']
            ]
        })
    }

    async findAll(entity: string, rowId: number) {
        return await this.entityHistoryRepository.findAll({
            where: {
                entity,
                rowId
            },
            include: [
                EntityHistory.associations.edits
            ],
            order: [
                ['id', 'ASC'],
                [EntityHistory.associations.edits, 'id', 'ASC']
            ]
        })
    }

    async findAllEdits(entity: string, rowId: number, fieldName: string = null) {
        const where = {
            entityHistoryId: {
                [Op.in]: (await this.entityHistoryRepository.findAll({
                    where: {
                        entity,
                        rowId
                    },
                    attributes: ['id']
                })).map(val => val.id)
            }
        };

        if(fieldName && fieldName.length > 0)
            where["fieldName"] = fieldName;

        return await this.entityEditRepository.findAll({
            where,
            include: [
                {
                    association: EntityEdit.associations.entityHistory,
                    attributes: ['id','createdAt'],
                    include: [
                        {
                            association: EntityHistory.associations.user,
                            attributes: ['name', 'lastname', 'patronymic']
                        }
                    ]
                }
            ],
            attributes: ['id', 'fieldName', 'oldData', 'newData'],
            order: [
                ['id', 'ASC']
            ]
        });
    }

    async getChangedAttrs(name: string, id: number) {
        return [...new Set((await this.findAllEdits(name, id)).filter(val => val.oldData != "null").map(val => val.fieldName))];
    }
}