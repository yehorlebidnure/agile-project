const {Connection} = require('../core/Connection');
const { Role } = require('../models');
const { Dao } = require('../core/Dao');
const { RoleBuilder } = require('../builder');
const { ServerError } = require('../utils/ErrorHelper/customErrors');

class RoleDao extends Dao {
    /**
     * UserDatabaseClient constructor
     * @param   {Connection}  client  client connection
     */
    constructor(client) {
        super(client);
    }

    /**
     * get role by property and its value
     * @param   {string}         name   attribute name
     * @param   {string|number}  value  attribute value
     * @return  {Promise<Role>}
     */
    async getByProperty(name, value) {
        let role = null;

        const sql = `select id, name from roles where ${name} = $1 limit 1`;
        const values = [value];

        try {
            // fetch data
            const data = await this.client.query(sql, values);
            const res = data.rows[0];

            if (res) {
                // create role role
                role = RoleBuilder.Build()
                    .addId(res['id'])
                    .addName(res['name'])
                    .build();
            }
        }
        catch (error) {
            throw new ServerError(`Failed to get role by property '${name}' from database`);
        }
        return role;
    }

    /**
     * get all roles
     * @param   {number}  page    page number
     * @param   {number}  amount  amount number
     * @return  {Promise<Role[]>}
     */
    async getAll(page, amount) {
        const roles = [];

        const sql = `select id, name from roles limit $1 offset $2`;
        const offset = (page - 1) * amount;
        const values = [amount, offset];

        try {
            const data = await this.client.query(sql, values);
            const res = data.rows;

            if (res.length !== 0) {
                res.forEach((row) => {
                    // create role role
                    const role = RoleBuilder.Build()
                        .addId(row['role_id'])
                        .addName(row['role_name'])
                        .build();

                    // add role to list
                    roles.push(role);
                });
            }
        }
        catch (error) {
            throw new ServerError('Failed to get roles from database');
        }
        return roles;
    }

    /**
     * create role in database
     * @param   {Role}  role  role
     * @return  {Promise<Role>}
     */
    async create(role) {
        let createdRole = null;

        const sql = `insert into roles(name) values($1) returning id;`
        const values = [rolename];

        try {
            const data = await this.client.query(sql, values);
            const res = data.rows[0];

            // expand role with inserted role id
            createdRole = RoleBuilder.Build()
                .setRole(role)
                .addId(res['id'])
                .build();
        }
        catch (error) {
            throw new ServerError('Failed to create role in database');
        }
        return createdRole;
    }

    /**
     * update role by property
     * @param   {Role}           role   role
     * @param   {string}         name   property name
     * @param   {number|string}  value  property value
     * @returns {Promise<number|string>}
     */
    async updateProperty(role, name, value) {
        let updatedProperty = null

        const sql = `update roles set ${name} = $1 where id = $2 returning ${name}`;
        const values = [value, role.id];

        try {
            const data = await this.client.query(sql, values);
            const res = data.rows[0];
            updatedProperty = res[name];
        }
        catch (error) {
            throw new ServerError(`Failed to update role property '${name}' in database`);
        }
        return updatedProperty;
    }

    /**
     * delete role by id
     * @param   {number}  id role id
     * @return  {Promise<void>}
     */
    async deleteById(id) {
        const sql = `delete from roles where id = $1`;
        const values = [id];

        try {
            await this.client.query(sql, values);
        }
        catch (error) {
            throw new ServerError(`Failed to delete role with id '${id}' from database`);
        }
    }
}

module.exports = { RoleDao };
