import bloodPressure from '../../templates/voiceintern/voiceintern.bloodPressure.v0.json'
import pulse from '../../templates/voiceintern/voiceintern.pulse.v0.json'
import EMD from '../../templates/voiceintern/kmc.emd.problemlist.v0.json'
// import pulseOxy from "../../templates/voiceintern/sample_template.json"
import type { Template } from '../types/types'


export const templateList: Template[] = [
    // pulseOxy,
    bloodPressure,
    pulse,
    EMD
]

export const templates = Object.fromEntries(templateList.map(template=>([template.templateId,  template])))