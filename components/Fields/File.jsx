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
         ProcessResourcesAction,
         UpdateStateAction } from '../../flux/Resource/ResourceActions';

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

        /**
         * Once processed, push the base64 data for images
         * to the cache, and tell the store we're no longer
         * processing images for this field.
         */
        var complete = () => {
            this.context.executeAction(UpdateStateAction, {
                [props.fieldID]: {
                    [props.patientID]: {
                        status: "waiting",
                        cache:  modifiedFiles
                    }
                }
            });
        };

        /**
         * Update ResourceStore so it know we're processing
         * the uploads for this file field.
         */
        this.context.executeAction(UpdateStateAction, {
            [props.fieldID]: {
                [props.patientID]: {
                    status: "processing"
                }
            }
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
        var inputDOM, cardsDOM, previewDOM;

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
            );
        }

        if(props.state === null) {
            inputDOM = (
                <div className="fluid ui action left icon input">
                    <i className="upload icon"></i>
                    <input type="text" value="Choose files." readOnly />
                    <label htmlFor={fileInputID} className="ui teal button">Choose</label>
                </div>
            );
        } else {
            if(props.state.hasOwnProperty('status')) {
                switch(props.state.status) {
                    case "uploading":
                        previewDOM = (
                            <ProgressScaffold
                                id={props.fieldID}
                                className="small active blue"
                                label={`Uploading ${props.state.cache.length} files...`}
                                percent={99}
                                autoSuccess={false} />
                        )
                        break;
                    case "processing":
                        previewDOM = (
                            <MessageScaffold
                                type="small info"
                                icon="notched circle loading"
                                header="Processing..." />
                        );
                        break;
                    case "waiting":
                        previewDOM = (
                            <div className="ui fluid card">
                                <div className="content">
                                    <div className="header">
                                        {props.state.cache.length} files ready for upload.
                                    </div>
                                </div>
                                <div className="extra content">
                                    <div className="small ui green basic left floated button" onClick={this._upload}>
                                        <i className="upload icon"></i>
                                        Upload
                                    </div>
                                    <div className="small ui red basic right floated button">
                                        <i className="remove icon"></i>
                                        Cancel
                                    </div>
                                </div>
                            </div>
                        );
                        break;
                }
            }
        }

        return (
            <div className="Forcept-File field">
                <Label field={field} />
                {cardsDOM}
                {previewDOM}
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
