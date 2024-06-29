import sqlite3 from "sqlite3";

export class FileHandler {

    private SEPARATOR: string = ";";
    HEADER: string[] = [];
    private db = new sqlite3.Database("database.sqlite");

    async create_table(header: string[]) {
        this.db.serialize(() => {
            this.HEADER = header;

            this.delete_table();

            const columns = this.HEADER.join(" TEXT, ");
            const create_table_query = `CREATE TABLE JOKE (${columns} TEXT)`;
            this.db.run(create_table_query);
        });

        return "Table created successfully";
    }

    async delete_table() {
        this.db.serialize(() => {
            this.db.run("DROP TABLE IF EXISTS JOKE");
        });

        return "Table deleted successfully";
    }

    async insert_values(lines: string[]) {
        for (const line of lines.slice(1)) {
            const values = line.split(this.SEPARATOR).map((line) => line.replace(/\r/g, ""));;

            const placeholders = values.map(() => "?").join(", ");
            const insert_values_query = `INSERT INTO JOKE VALUES (${placeholders})`;
            await this.db.run(insert_values_query, values);
        }

        return "Items inserted successfully";
    }

    async search_values(value: string) {
        try {
            if (!this.HEADER || this.HEADER.length === 0) {
                throw new Error('Header is empty or not defined');
            }

            return new Promise((resolve, reject) => {
                const conditions = this.HEADER.map(column => {
                    const cleanColumn = column.replace(/\r/g, "");
                    return `${cleanColumn} LIKE "%${value}%"`;
                }).join(" OR ");

                const select_query = `SELECT * FROM JOKE WHERE ${conditions}`;

                let json_data: any[] = [];

                this.db.all(select_query, (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    rows.forEach((row: any) => {
                        let item: any = {};
                        this.HEADER.forEach(col => {
                            item[col] = row[col];
                        });
                        json_data.push(item);
                    });

                    resolve(json_data);
                });
            });
        } catch (err) {
            console.log("Error in search_values function: " + err);
            return [];
        }
    }

}