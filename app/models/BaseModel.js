module.exports = function(db) {
    this.db = db;
};
module.exports.prototype = {
    table_name: '',
    extend: function(properties) {
        Child = module.exports;
        Child.prototype = module.exports.prototype;
        for (key in properties) {
            Child.prototype[key] = properties[key];
        }

        return Child;
    },
    inherits: function(child, properties) {
        for (key in properties) {
            child.key = properties[key];
        }

        return child;
    },
    setDB: function(db) {
        this.db = db;
    },
    prepareInsertQuery: async function(dataArray, table_name) {
        fields = '';
        values = '';
        sql = '';

        for (item in dataArray) {
            //-- Dont add space after comma
            fields = fields.concat(item + ',');

            //-- Dont add space after comma 
            values = values.concat(" '" + dataArray[item] + "'" + ',');
        }

        //-- Remove the last character which is comma
        values = values.substr(0, values.length - 1);

        //-- Remove the last character which is comma
        fields = fields.substr(0, fields.length - 1);

        sql = "INSERT INTO " + table_name + " (" + fields + ") VALUES (" + values + ")";

        return sql;
    },
    prepareAttributes: async function(attr) {
        selection = '';

        for (i = 0; i < attr.length; i++) {
            //-- Dont add space after comma for formatting it is part of logic
            selection = selection.concat(attr[i] + ',');
        }

        //-- Remove the last character which is comma
        selection = selection.substr(0, selection.length - 1);

        return selection;
    },
    prepareBindWhere: async function(fields) {
        if (typeof fields !== "object") {
            return { bind: {}, where: '' };
        }

        const bind = {};
        let where = '';

        Object.entries(fields).forEach(([field, value]) => {
            where += `${field} = $${field} AND `;
            bind[field] = value;
        });

        if (where.length > 0) {
            where = ' WHERE ' + where.slice(0, -5); // Remove the last 'AND' and space
        }

        return { bind, where };
    },
    insertRow: async function(data) {
        self = this;
        const sql = await self.prepareInsertQuery(data, self.table_name);

        return await this.db.query(sql)
            .then(dbRes => {
                return dbRes[0];
            })
            .catch(error => {
                throw (error);
            });
    },
    updateRow: async function(data, fields, status = false) {
        try {
            const condition = await this.prepareBindWhere(fields);
            const updateAttributes = this.generateUpdateAttributes(data);

            const sql = `UPDATE ${this.table_name} SET ${updateAttributes} ${condition.where}`;

            await this.db.query(sql, {
                bind: condition.bind
            });

            if (status) {
                return status;
            }

            const updatedRecord = await this.getRow('*', condition);
            if (!updatedRecord) {
                return null;
            }

            return updatedRecord;
        } catch (error) {
            throw (error);
        }
    },
    generateUpdateAttributes: function(data) {
        if (typeof data === 'object') {
            return Object.entries(data)
                .map(([key, value]) => `${key}='${value}'`)
                .join(',');
        } else {
            return data;
        }
    },
    getRow: async function(attr, fields) {
        try {
            const attributes = typeof attr === "object" ? await this.prepareAttributes(attr) : attr;
            const condition = fields.bind === undefined ? await this.prepareBindWhere(fields) : fields;
            const sql = `SELECT ${attributes} FROM ${this.table_name} ${condition.where}`;

            const dbRes = await this.db.query(sql, { bind: condition.bind, type: this.db.QueryTypes.SELECT });

            if (dbRes && dbRes.length > 0) {
                const data = dbRes[0];
                if (data.password !== undefined) {
                    delete data.password;
                }
                return data;
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err.original?.sqlMessage || err.message);
        }
    },
    deleteRow: async function(fields) {
        const type = typeof fields;

        let condition = null;

        if (type === "object") {
            condition = await this.prepareBindWhere(fields);
        }

        const sql = `DELETE FROM ${this.table_name} ${condition ? condition.where : ''}`;

        try {
            const dbRes = await this.db.query(sql, {
                bind: condition ? condition.bind : null
            });

            if (dbRes && dbRes[0].affectedRows > 0) {
                return true;
            } else {
                return null;
            }
        } catch (err) {
            throw err.original.sqlMessage;
        }
    },
    execute: async function(sql, bind = '') {
        return await this.db.query(sql, {
            bind: bind,
            type: this.db.QueryTypes.SELECT
        }).then(dbRes => {
            return dbRes;
        }).catch(err => {
            throw (err.original.sqlMessage);
        });
    }
};