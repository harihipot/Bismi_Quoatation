import SQLiteStorage from 'react-native-sqlite-storage';

const databaseName = 'Bismi.db';
const databaseVersion = '1.0';
const databaseDisplayname = 'Bismi';
const databaseSize = -1;
let database;

export default class SQLite {
  static cutomerTableName = 'customer';
  static productTableName = 'product';

  static open(success, error) {
    if (!database) {
      SQLiteStorage.openDatabase(
        databaseName,
        databaseVersion,
        databaseDisplayname,
        databaseSize,
      ).then(db => {
        database = db;
        success(database);
      });
    } else {
      success(database);
    }
  }

  static createTable(sqlStr, success, error) {
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            tx.executeSql(
              sqlStr,
              [],
              () => {
                success();
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }

  static wipeTableData(tableName, success, error) {
    SQLite.open(
      db => {
        db.transaction(tx => {
          tx.executeSql(
            `delete from ${tableName};`,
            [],
            () => {
              success();
            },
            err => {
              error(err);
            },
          );
        });
      },
      err => {
        error(err);
      },
    );
  }

  static dropTable(tableName, success, error) {
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            tx.executeSql(
              `drop table ${tableName};`,
              [],
              () => {
                success();
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }

  static createTableSqlStr(tableName, fields) {
    let sqlStr = `CREATE TABLE IF NOT EXISTS ${tableName}(`;
    const keys = Object.keys(fields);
    keys.forEach(key => {
      const value = fields[key];
      sqlStr = `${sqlStr + key} ${value} ${
        key === 'id' ? 'PRIMARY KEY AUTOINCREMENT' : ''
      },`;
    });
    sqlStr = sqlStr.substring(0, sqlStr.lastIndexOf(','));
    sqlStr += ');';
    return sqlStr;
  }

  static createInsertSqlStr(tableName, dataObj) {
    const keys = Object.keys(dataObj);
    let fieldSqlStr = `INSERT INTO ${tableName}(`;
    let valueSqlStr = ') values(';
    keys.forEach(key => {
      fieldSqlStr = `${fieldSqlStr + key},`;
      valueSqlStr += '?,';
    });
    fieldSqlStr = fieldSqlStr.substring(0, fieldSqlStr.lastIndexOf(','));
    valueSqlStr = valueSqlStr.substring(0, valueSqlStr.lastIndexOf(','));
    const sql = `${fieldSqlStr}${valueSqlStr});`;
    return sql;
  }

  static insertData(sqlStr, values, success, error) {
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            tx.executeSql(
              sqlStr,
              values,
              () => {
                success();
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }

  static close() {
    if (database) {
      database.close();
    } else {
      // console.log('SQLiteStorage not open');
    }
    database = null;
  }

  static queryDatas(sqlStr, success, error) {
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            tx.executeSql(
              sqlStr,
              [],
              (_tx, results) => {
                const {length} = results.rows;
                const datas = [];
                for (let i = 0; i < length; i++) {
                  datas.push(results.rows.item(i));
                }
                success(datas);
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }

  static createCutomerTable(success, error) {
    const tableStructure = {
      id: 'INTEGER',
      name: 'VARCHAR',
      addressOne: 'VARCHAR',
      addressTwo: 'VARCHAR',
      city: 'VARCHAR',
      pincode: 'VARCHAR',
      state: 'VARCHAR',
      phone: 'VARCHAR',
      gstNo: 'VARCHAR',
    };

    const sql = SQLite.createTableSqlStr(
      SQLite.cutomerTableName,
      tableStructure,
    );

    SQLite.createTable(
      sql,
      () => {
        if (success) {
          success();
        }
      },
      err => {
        error();
      },
    );
  }

  static insertCustomers(customer, success, error) {
    const customerObj = {...customer};

    const insertSql = SQLite.createInsertSqlStr(
      SQLite.cutomerTableName,
      customerObj,
    );
    const keys = Object.keys(customerObj);
    const values = Object.values(customerObj);
    const newValues = [];

    for (let index = 0; index < values.length; index += 1) {
      const key = keys[index];
      const element = values[index];
      if (typeof element === 'object') {
        const val = JSON.stringify(element);
        newValues.push(val);
      } else if (element !== undefined && element !== null) {
        newValues.push(element);
      } else {
        newValues.push('');
      }
    }
    SQLite.insertData(
      insertSql,
      newValues,
      () => {
        success();
      },
      err => {
        error(err);
      },
    );
  }

  static queryAllCustomers(success, error) {
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            const sqlStr = `select * from ${SQLite.cutomerTableName};`;
            tx.executeSql(
              sqlStr,
              [],
              (_tx, results) => {
                const {length} = results.rows;
                const datas = [];
                for (let i = 0; i < length; i += 1) {
                  const item = results.rows.item(i);
                  datas.push(item);
                }
                success(datas);
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }

  static createProductTable(success, error) {
    const tableStructure = {
      id: 'INTEGER',
      name: 'VARCHAR',
      price: 'VARCHAR',
      sizeInMM: 'VARCHAR',
      sizeInInches: 'VARCHAR',
      weight: 'VARCHAR',
      noc: 'VARCHAR',
    };

    const sql = SQLite.createTableSqlStr(
      SQLite.productTableName,
      tableStructure,
    );

    SQLite.createTable(
      sql,
      () => {
        if (success) {
          success();
        }
      },
      err => {
        error();
      },
    );
  }

  static insertProducts(customer, success, error) {
    const customerObj = {...customer};

    const insertSql = SQLite.createInsertSqlStr(
      SQLite.productTableName,
      customerObj,
    );
    const keys = Object.keys(customerObj);
    const values = Object.values(customerObj);
    const newValues = [];

    for (let index = 0; index < values.length; index += 1) {
      const key = keys[index];
      const element = values[index];
      if (typeof element === 'object') {
        const val = JSON.stringify(element);
        newValues.push(val);
      } else if (element !== undefined && element !== null) {
        newValues.push(element);
      } else {
        newValues.push('');
      }
    }
    SQLite.insertData(
      insertSql,
      newValues,
      () => {
        success();
      },
      err => {
        error(err);
      },
    );
  }

  static queryAllProducts(success, error) {
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            const sqlStr = `select * from ${SQLite.productTableName};`;
            tx.executeSql(
              sqlStr,
              [],
              (_tx, results) => {
                const {length} = results.rows;
                const datas = [];
                for (let i = 0; i < length; i += 1) {
                  const item = results.rows.item(i);
                  datas.push(item);
                }
                success(datas);
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }

  static deleteItemInTable(item, isCustomer, success, error) {
    let query = '';
    if (isCustomer) {
      query = `DELETE FROM ${SQLite.cutomerTableName} WHERE id='${item.id}'`;
    } else {
      query = `DELETE FROM ${SQLite.productTableName} WHERE id='${item.id}'`;
    }
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            tx.executeSql(
              query,
              [],
              (_tx, results) => {
                success();
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }

  static updateItemInTable(newData, existingData, isCustomer, success, error) {
    let query = '';
    if (isCustomer) {
      query = `UPDATE ${SQLite.cutomerTableName} SET name = '${newData.name}', 
      addressOne = '${newData.addressOne}',
      addressTwo = '${newData.addressTwo}', 
      city = '${newData.city}', 
      pincode = '${newData.pincode}', 
      state = '${newData.state}',
      phone = '${newData.phone}', 
      gstNo = '${newData.gstNo}'
      WHERE id='${existingData.id}'`;
    } else {
      query = `UPDATE ${SQLite.productTableName} SET name = '${newData.name}', 
      price = '${newData.price}',
      sizeInMM = '${newData.sizeInMM}', 
      sizeInInches = '${newData.sizeInInches}', 
      weight = '${newData.weight}', 
      noc = '${newData.noc}' WHERE id='${existingData.id}'`;
    }
    SQLite.open(
      db => {
        db.transaction(
          tx => {
            tx.executeSql(
              query,
              [],
              (_tx, results) => {
                success();
              },
              err => {
                error(err);
              },
            );
          },
          err => {
            error(err);
          },
          () => {},
        );
      },
      err => {
        error(err);
      },
    );
  }
}
