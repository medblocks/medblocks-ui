export const rawTree = {
    "id" : "presence",
    "name" : "Presence",
    "localizedName" : "Presence",
    "rmType" : "DV_CODED_TEXT",
    "nodeId" : "at1005",
    "min" : 0,
    "max" : 1,
    "localizedNames" : {
      "en" : "Presence"
    },
    "localizedDescriptions" : {
      "en" : "Presence of a pulse or heart beat."
    },
    "annotations" : {
      "comment" : "It can be implied that the pulse or heart beat is present if Rate >0 /min."
    },
    "aqlPath" : "/content[openEHR-EHR-OBSERVATION.pulse.v2]/data[at0002]/events[at0003]/data[at0001]/items[at1005]/value",
    "inputs" : [ {
      "suffix" : "code",
      "type" : "CODED_TEXT",
      "list" : [ {
        "value" : "at1024",
        "label" : "Present",
        "localizedLabels" : {
          "en" : "Present"
        },
        "localizedDescriptions" : {
          "en" : "A pulse or heart beat can be detected."
        }
      }, {
        "value" : "at1025",
        "label" : "Not detected",
        "localizedLabels" : {
          "en" : "Not detected"
        },
        "localizedDescriptions" : {
          "en" : "A pulse or heart beat cannot be detected."
        }
      } ]
    }]}