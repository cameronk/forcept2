/**
 * forcept - database/StageDefinition.js
 * @author Azuru Technology
 */

import debug from 'debug';

const __debug = debug('forcept:database:StageDefinition');

/**
 *
 */
export function BaseStageDefinition(db) {
    return {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: db.Sequelize.INTEGER
        },
        visit: {
            allowNull: false,
            type: db.Sequelize.INTEGER
        },
        patient: {
            allowNull: false,
            type: db.Sequelize.INTEGER
        }
    };
};

/**
 * Update Sequelize model definition for a particular stage.
 * @param stage - Sequelize model representing the stage to update
 * @param db    - contains Sequelize, sequelize, models
 */
export default function UpdateStageDefinition(stage, db) {

    __debug("Updating stage definition for %s @ %s", stage.get('name'), stage.get('tableName'));

    let fields = {};
    let tableName = stage.get('tableName');

    for(var field in stage.get('fields')) {
        fields[field] = {
            type: db.Sequelize.INTEGER,
            allowNull: true
        }
    }

    db.sequelize.define(
        tableName,
        Object.assign({}, BaseStageDefinition(db), fields),
        {
            freezeTableName: true,
            tableName: tableName
        }
    );
    
}
