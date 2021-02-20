const AbstractChecker = require("../utils/abstractChecker");

module.exports = class BaseRepository {
  constructor(schema) {
    AbstractChecker.check(this, new.target, ["create", "update"]);
    this._schema =  schema;
  }

  generateId() {
    return 'asdasd';
  }

  formatSql(query, valueArray) {
    // return mysql.format(query, valueArray);
    return;
  }

  async execute(query) {
    // return await this._db.executeQuery(query);
    return
  }

  async getAll(queryParams) {
    let limit = queryParams.pageSize || 100;

    let schema;

    schema = await this._schema.find(); 

    return schema;
  }

  async getCount() {
    let query = mysql.format(`select count(*) from ${this._tableName}`);
    return await this.execute(query);
  }

  async create(entity) {
    console.log('Request body: ', entity);
    let schema;

    schema = await this._schema(entity).save(); 

    return schema;
  }

  async update(id, entity) {
    let keys = SchemaConverter.getSchemaKeys(this._schema);
    let setKeys = [];
    let values = [];
    for(let k of keys){
      if(entity.hasOwnProperty(k)){
        setKeys.push(`${k}=?`);
        values.push(entity[k]);
      }
    }
    values.push(id);
    let query = this.formatSql(
      `update ${
        this._tableName
      } set ${setKeys.join(',')} where id =?`,
      values
    );

    let result = await this.execute(query);
    if (result && result.affectedRows === 1) {
      return {
        entity:this._tableName,
        id,
        status: "updated"        
      }
    }

    return null;
  }

  async get(id) {
    let schema;

    schema = await this._schema.findById(id); 

    return schema;
  }

  async delete(id) {
    let schema;

    schema = await this._schema.deleteOne({ _id: id }); 

    return schema;
  }
};
