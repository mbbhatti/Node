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
        type = typeof fields;
        bind = {};
        where = '';

        if (type == "object") {
            for (field in fields) {
                where = where.concat(field + " = $" + field + " AND ");
                bind[field] = fields[field];
            }
            //-- Remove the last word
            where = " WHERE " + where.substr(0, where.length - 4);
        }

        return {
            'bind': bind,
            'where': where
        }

    },
    insertRow: async function(data, attr) {
        self = this;
        sql = await self.prepareInsertQuery(data, self.table_name);

        return await this.db.query(sql).then(dbRes => {
            return dbRes[0];
        }).catch(err => {
            throw (err);
        });
    },
    getRow: async function(attr, fields) {
        self = this;
        type = typeof attr;

        if (type == "object") {
            attr = await self.prepareAttributes(attr);
        }

        if (fields.bind == undefined) {
            condition = await self.prepareBindWhere(fields);
        } else {
            condition = fields;
        }

        sql = "SELECT " + attr + " FROM " + self.table_name + condition.where;

        return await this.db.query(sql, {
            bind: condition.bind,
            type: this.db.QueryTypes.SELECT
        }).then(dbRes => {
            if (dbRes.length > 0) {
                data = dbRes[0];
                if (data.password != undefined) {
                    delete data.password;
                }
                return data;
            } else {
                return 'NotFound';
            }
        }).catch(err => {
            throw (err.original.sqlMessage);
        });

    },
    updateRow: async function(data, fields) {
        self = this;
        type = typeof data;
        update_attr = '';

        condition = await self.prepareBindWhere(fields);

        if (type == "object") {
            for (item in data) {
                //-- Dont add space after comma
                update_attr = update_attr.concat(item + "='" + data[item] + "',");
            }

            //-- Remove the last character which is comma
            update_attr = update_attr.substr(0, update_attr.length - 1);
        } else {
            update_attr = data;
        }

        sql = "UPDATE " + this.table_name + " SET " + update_attr + " " + condition.where;

        await this.db.query(sql, {
                bind: condition.bind
            })
            .then()
            .catch(err => {
                throw (err.original.sqlMessage);
            });

        return await this.getRow('*', condition);
    },
    deleteRow: async function(fields) {
        self = this;
        type = typeof fields;

        if (type == "object") {
            condition = await self.prepareBindWhere(fields);
        }

        sql = "DELETE  FROM " + this.table_name + " " + condition.where;

        return await this.db.query(sql, {
            bind: condition.bind
        }).then(dbRes => {
            if (dbRes[0].affectedRows > 0) {
                return '';
            } else {
                return 'NotFound';
            }
        }).catch(err => {
            throw (err.original.sqlMessage);
        });
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