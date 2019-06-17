module.exports = function(db) {
    this.db = db;
};
module.exports.prototype = {
    table_name: '',
    extend: function(properties) {
        var Child = module.exports;
        Child.prototype = module.exports.prototype;
        for (var key in properties) {
            Child.prototype[key] = properties[key];
        }
        return Child;
    },
    inherits: function(child, properties) {
        for (var key in properties) {
            child.key = properties[key];
        }
        return child;
    },
    setDB: function(db) {
        this.db = db;
    },
    prepareInsertQuery: function(dataArray, table_name) {

        var fields = '';
        var values = '';
        var sql = '';
        for (var item in dataArray) {
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
    prepareAttributes: function(attr) {

        var selection = '';
        for (i = 0; i < attr.length; i++) {
            //-- Dont add space after comma for formatting it is part of logic
            selection = selection.concat(attr[i] + ','); 
        }
        
        //-- Remove the last character which is comma
        selection = selection.substr(0, selection.length - 1); 
        
        return selection;

    },
    insertRow: function(data, attr, callback) {
        var self = this;
        sql = self.prepareInsertQuery(data, self.table_name);

        this.db.query(sql).then(() => {
            sql = "SELECT MAX(" + attr + ") as id FROM " + self.table_name;
            self.db.query(sql).then(dbRes => {
                if (dbRes.length > 0) {
                    callback(false, dbRes[0][0]);
                } else {
                    callback(false, '');
                }
            }).catch(err => {
                callback(true, err);
            });
        }).catch(err => {
            callback(true, err);
        });
    },
    getRow: function(attr, where, callback) {
        var type = typeof attr;
        if (type == "object") {
            attr = this.prepareAttributes(attr);
        }
        if (where != '' || where != 'undefined' || where != null) {
            where = " WHERE " + where
        } else {
            where = '';
        }

        var sql = "SELECT " + attr + " FROM " + this.table_name + " " + where;
        this.db.query(sql).then(dbRes => {
            let data = dbRes[0][0];
            delete data.password;
            callback(false, data);
        }).catch(err => {
            callback(true, err);
        });

    },
    updateRow: function(data, where, callback) {

        var update_attr = '';
        var type = typeof data;

        if (where != '' || where != 'undefined' || where != null) {
            where = " WHERE " + where
        } else {
            callback(true);
        }

        if (type == "object") {
            for (var item in data) {
                //-- Dont add space after comma
                update_attr = update_attr.concat(item + "='" + data[item] + "',"); 
            }
            
            //-- Remove the last character which is comma
            update_attr = update_attr.substr(0, update_attr.length - 1); 
        } else {
            update_attr = data;
        }

        sql = "UPDATE " + this.table_name + " SET " + update_attr + " " + where;
        this.db.query(sql).then(() => {
            sql = "SELECT * FROM " + this.table_name + where;
            this.db.query(sql).then(dbRes => {
                if (dbRes.length > 0) {
                    let data = dbRes[0][0];
                    delete data.password;
                    callback(false, data);
                } else {
                    callback(false, '');
                }
            }).catch(err => {
                callback(true, err);
            });
        }).catch(err => {
            callback(true, err);
        });
    },
    deleteRow: function(where, callback) {

        if (where != '' || where != 'undefined' || where != null) {
            where = " WHERE " + where
        } else {
            callback(true);
        }
        var sql = "DELETE  FROM " + this.table_name + " " + where;
        this.db.query(sql).then(dbRes => {
            if (dbRes[0].affectedRows > 0) {
                callback(false, '');
            } else {
                callback(true, "ID doesn't exist");
            }
        }).catch(err => {
            callback(true, err);
        });
    }
};