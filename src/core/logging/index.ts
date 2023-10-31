export async function log(dir: string, file: string, maxsize: number, message: string, cons: boolean = false) {
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const logfile = path.join(dir, file);
    //--Проверить наличие файла лога и его размер--
    if (fs.existsSync(logfile)) {
        let stats = fs.statSync(logfile);
        //--Вычислить количество файлов лога и переименовать текущий файл--
        if (stats.size >= maxsize) {
            let files = fs.readdirSync(dir);
            let logs = 0;
            files.forEach(fl => {
                let stat = fs.lstatSync(path.join(dir, fl));
                if (!stat.isDirectory())
                    if (file.indexOf(file) >= 0)
                        logs++;
            });

            fs.rename(logfile, logfile + "-" + logs, (err) => {
                if (err) console.error(err);
            });
        }
    }

    if (cons)
        console.info(message);

    fs.writeFileSync(logfile, message,
        {
            flag: "as"
        },
        function (err) {
            if (err)
                console.error(err);
        });
}