/**
 * forcept - database/StageDefinition.js
 * @author Azuru Technology
 */

import debug from 'debug';
import ModelHelper from './helper';

const __debug = debug('forcept:database:StageDefinition');

/**
 * Build the base definition object for a stage based on stage.isRoot
 * @param isRoot
 * @param db
 */
export function BaseStageDefinition(isRoot, db) {

    var meta = {};
    var DataTypes = db.Sequelize;

    if(isRoot) {
        meta = {
            currentVisit: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            visits: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: "[]",
                get: function() {
                    return ModelHelper.jsonGetter(
                        this.getDataValue('visits')
                    );
                },
                set: function(val) {
                    var visits = this.getDataValue('visits') || [];
                    if(typeof visits === "string") {
                        if(visits == "[]") {
                            visits = [];
                        } else {
                            visits = ModelHelper.jsonGetter(visits);
                        }
                    }

                    val.map(visitID => {
                        if(visits.indexOf(visitID) == -1) {
                            visits.push(visitID);
                        }
                    });

                    this.setDataValue('visits', ModelHelper.jsonSetter(visits));
                }
            },
            concrete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdBy: DataTypes.INTEGER,
            lastModifiedBy: DataTypes.INTEGER,
        };
    } else {
        meta = {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            visit: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            patient: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        };
    }

    return Object.assign(meta, {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

};

/**
 * Apply custom options (such as getter methods) based on stage.isRoot
 * @param isRoot
 * @param tableName
 * @param db
 */
export function BaseStageOptions(isRoot, tableName) {
    var meta = {};

    if(isRoot) {
        meta = {
            getterMethods: {
                fullName: function() {
                    let name = [];
                    if(this.firstName) name.push(this.firstName);
                    if(this.lastName)  name.push(this.lastName);
                    return name.join(" ");
                }
            }
        };
    }

    return Object.assign(meta, {
        freezeTableName: true,
        tableName: tableName
    });
}

/**
 * Update Sequelize model definition for a particular stage.
 * @param stage - Sequelize model representing the stage to update
 * @param db    - contains Sequelize, sequelize, models
 */
export default function UpdateStageDefinition(stage, db) {

    var allFields = stage.get('fields');
    var fields = {};
    var tableName = stage.get('tableName');
    var modelName = stage.get('modelName');

    __debug("> Updating stage definition for %s @ %s", stage.get('name'), modelName);

    for(let field in allFields) {

        let thisField = allFields[field];
        __debug("| %s (%s)", field, thisField.type);

        /*
         * Add a definition for this field.
         */
        fields[field] = ((id, type) => {
            switch(type) {

                /*
                 *
                 */
                case "select":
                case "file":
                    __debug("|==> JSON");
                    return {
                        type: db.Sequelize.TEXT,
                        get: function() {
                            return ModelHelper.jsonGetter(
                                this.getDataValue(id),
                                []
                            );
                        },
                        set: function(val) {
                            this.setDataValue(id, ModelHelper.jsonSetter(val, "[]"));
                        }
                    };
                    break;

                /*
                 * Fields stored as raw text
                 */
                default:
                    __debug("|==> text")
                    return {
                        type: db.Sequelize.TEXT,
                        allowNull: true
                    };
                    break;
            }
        })(field, thisField.type);

    }

    /*
     * Push back to available record models
     * if this model has not yet been defined
     * (occurs at startup OR during stage creation)
     */
    if(!db.RecordModels.hasOwnProperty(modelName)) {
        db.RecordModels[modelName] = stage.get('id');
    }

    db.sequelize.define(
        modelName,
        Object.assign(
            {},
            BaseStageDefinition(stage.get('isRoot') || false, db),
            fields
        ),
        Object.assign(
            {},
            BaseStageOptions(stage.get('isRoot') || false, tableName)
        )
    );

}
