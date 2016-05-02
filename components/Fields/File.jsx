/**
 * forcept - components/Fields/File.jsx
 * @author Azuru Technology
 *
 * https://www.npmjs.com/package/jimp
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import pullAllBy from 'lodash/pullAllBy';
import debug from 'debug';

import Label from './Label';
import MessageScaffold from '../Scaffold/Message';
import ProgressScaffold from '../Scaffold/Progress';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';
import { UpdateCacheAction, UploadResourcesAction,
         ProcessResourcesAction } from '../../flux/Resource/ResourceActions';

const __debug = debug('forcept:components:Fields:File');

if(process.env.BROWSER) {
    require('../../styles/fields/File.less');
}

class FileField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    _remove = (id) => {
        return () => {
            var { patientID, stageID, fieldID, value } = this.props;
            __debug("[%s] => _remove", fieldID);
            __debug("| removing '%s'", id);
            __debug("| value: %j", value);
            __debug("| pulled: %j", pullAllBy(value, { id: id }, 'id'));
            this.context.executeAction(UpdatePatientAction, {
                [patientID]: {
                    [stageID]: {
                        [fieldID]: pullAllBy(value, [{ id: id }], 'id')
                    }
                }
            });
        };
    }

    /**
     *
     */
    _select = (evt) => {

        var { props } = this,
            { files } = evt.target,
            countFiles = files.length,
            modifiedFiles = [];

        var complete = () => {
            this.context.executeAction(UpdateCacheAction, {
                [props.fieldID]: modifiedFiles
            });
            this.context.executeAction(ProcessResourcesAction, {
                [props.fieldID]: false
            });
        };

        this.context.executeAction(ProcessResourcesAction, {
            [props.fieldID]: true
        });

        /*
         * Loop through uploaded files.
         */
        for(var i = 0; i < countFiles; i++) {

            var thisFile = files[i],
                reader = new FileReader(),
                n = i;

            /*
             * Process file based on type.
             */
            if(thisFile.type.match('image.*')) {

                var maxWidth = (props.hasOwnProperty("maxWidth") ? props.maxWidth : 310),
                	maxHeight = (props.hasOwnProperty("maxHeight") ? props.maxHeight : 310);

                /*
                 * Apply onload handler to reader.
                 */
                reader.onload = (readerEvent) => {

                    /*
                     * Create an image object.
                     */
                    var image = new Image();

                    /*
                     * Handle image loading.
                     */
                    image.onload = (imageEvent) => {

                        var canvas = document.createElement("canvas"),
                            width = image.width,
                            height = image.height;

                        /*
                         * Determine canvas sizing.
                         */
                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }
                        }

                        /*
                         * Apply canvas sizing.
                         */
                        canvas.width = width;
                        canvas.height = height;

                        /*
                         * Draw image on canvas context.
                         */
                        canvas.getContext("2d").drawImage(image, 0, 0, width, height);

                        /*
                         * Push DataURL for jpeg canvas image to modified files.
                         */
                        modifiedFiles[n] = canvas.toDataURL("image/jpeg", 0.5);

                        /*
                         * Check if we're done looping through files.
                         */
                        if((n + 1) === countFiles) {
                            complete();
                        }
                    };

                    /*
                     * Update image source with upload target result.
                     */
                    image.src = readerEvent.target.result;

                };

                /*
                 * Read this file as a data URL.
                 */
                reader.readAsDataURL(thisFile);

            }

        }

    }

    /**
     *
     */
    _upload = () => {
        var { patientID, stageID, fieldID } = this.props;
        this.context.executeAction(UploadResourcesAction, {
            fieldID: fieldID,
            stageID: stageID,
            patientID: patientID,
        });
    }

    /**
     *
     */
    render() {
        var props = this.props,
            { field, value } = props;

        var fileInputID = props.fieldID;
        var inputDOM, cardsDOM;

        if(value.length > 0) {
            cardsDOM = (
                <div className="stackable ui cards">
                    {value.map(({ type, id, ext }) => {
                        switch(type) {
                            case "image/jpeg":
                                return (
                                    <div className="card">
                                        <div className="ui image">
                                            <img src={["/resources/", id, ext].join("")} />
                                        </div>
                                        <div className="extra content">
                                            <div className="ui fluid basic red button" onClick={this._remove(id)}>
                                                <i className="delete icon"></i> Remove
                                            </div>
                                        </div>
                                    </div>
                                );
                                break;
                        }
                    })}
                </div>
            )
        }

        if(props.uploading === false) {
            inputDOM = (
                <div className="fluid ui action left icon input">
                    <i className="upload icon"></i>
                    <input type="text"
                        value={props.cache ? (props.cache.length + ' files selected...') : 'Choose a file with the adjacent button...'}
                        readOnly />
                    {(() => {
                        if(props.cache) {
                            return (
                                <div className="ui green button" onClick={this._upload}>
                                    Upload {props.cache.length} files
                                </div>
                            );
                        } else {
                            return (
                                <label htmlFor={fileInputID} className="ui teal button">
                                    Choose
                                </label>
                            );
                        }
                    })()}
                </div>
            );
        }

        return (
            <div className="Forcept-File field">
                <Label field={field} />
                {cardsDOM}
                {(() => {
                    /*
                     * Show processing message.
                     */
                    if(props.processing === true) {
                        return (
                            <MessageScaffold
                                type="small info"
                                icon="notched circle loading"
                                header="Processing..." />
                        );
                    }

                    /*
                     * Show uploading bar.
                     */
                    else if(props.uploading !== false) {
                        return (
                            <ProgressScaffold
                                id={props.fieldID}
                                className="small active blue"
                                label={`Uploading ${props.cache.length} files...`}
                                percent={99}
                                autoSuccess={false} />
                        );
                    }
                })()}
                <input
                    type="file"
                    accept={field.settings.accept.join(",")}
                    className="hidden"
                    id={fileInputID}
                    onChange={this._select} />
                {inputDOM}
            </div>
        );
    }
}

export default FileField;
