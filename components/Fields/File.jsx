/**
 * forcept - components/Fields/File.jsx
 * @author Azuru Technology
 *
 * https://www.npmjs.com/package/react-File-picker
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import debug from 'debug';

import Label from './Label';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdateCacheAction, UploadResourcesAction } from '../../flux/Resource/ResourceActions';

const __debug = debug('forcept:components:Fields:File');

if(process.env.BROWSER) {
    require('../../styles/fields/File.less');
}

class FileField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

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
        };

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
        this.context.executeAction(UploadResourcesAction, this.props.fieldID);
    }

    /**
     *
     */
    render() {
        var props = this.props,
            { field, value } = props;

        var fileInputID = `${props.fieldID}`;

        return (
            <div className="field">
                <Label field={field} />
                <input type="file" className="hidden" id={fileInputID} onChange={this._select} />
                <div className="fluid ui action left icon input">
                    <i className="upload icon"></i>
                    <input type="text"
                        value={props.cache ? (props.cache.length + ' files selected...') : 'Choose a file with the adjacent button...'}
                        readOnly />
                    {(() => {
                        if(props.cache) {
                            let isUploading = props.upload.context === props.fieldID;
                            return (
                                <div className={BuildDOMClass("ui green", { "loading": isUploading }, "button")} onClick={isUploading ? null : this._upload}>
                                    Upload
                                    {props.cache.length}
                                    files
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
            </div>
        );
    }
}

export default FileField;
