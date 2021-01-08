export const rawTree = {
    "id": "ordinal_value",
    "localizedName": "Best eye response (E)",
    "rmType": "DV_ORDINAL",
    "nodeId": "",
    "min": 0,
    "max": 1,
    "localizedNames": {
        "en": "Best eye response (E)"
    },
    "localizedDescriptions": {
        "en": "Best response of eyes to test stimulus."
    },
    "aqlPath": "/content[openEHR-EHR-OBSERVATION.glasgow_coma_scale.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0009]/value",
    "inputs": [{
        "type": "CODED_TEXT",
        "list": [{
            "value": "at0010",
            "label": "None",
            "localizedLabels": {
                "en": "None"
            },
            "localizedDescriptions": {
                "en": "No eye opening at any time, no interfering factor. For example: eyes closed by local swelling."
            },
            "ordinal": 1
        }, {
            "value": "at0011",
            "label": "To pressure",
            "localizedLabels": {
                "en": "To pressure"
            },
            "localizedDescriptions": {
                "en": "Eyes opening after finger tip stimulus."
            },
            "ordinal": 2
        }, {
            "value": "at0012",
            "label": "To sound",
            "localizedLabels": {
                "en": "To sound"
            },
            "localizedDescriptions": {
                "en": "Eyes opening after spoken or shouted request. Not to be confused with wakening of a sleeping person."
            },
            "ordinal": 3
        }, {
            "value": "at0013",
            "label": "Spontaneous",
            "localizedLabels": {
                "en": "Spontaneous"
            },
            "localizedDescriptions": {
                "en": "Eyes open before stimulus."
            },
            "ordinal": 4
        }]
    }]
}