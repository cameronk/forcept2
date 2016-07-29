/**
 *
 */

import { defineMessages } from 'react-intl';
const root = "patient.";

export default defineMessages({

    ///
    noun: {
        id: root + "noun",
        defaultMessage: "Patient"
    },
    pluralNoun: {
        id: root + "pluralNoun",
        defaultMessage: "Patients"
    },

    ///
    untitled: {
        id: root + "untitled",
        defaultMessage: "Unnamed patient"
    }

});
