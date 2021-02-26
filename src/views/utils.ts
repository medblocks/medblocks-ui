import { addMinutes, formatDistance } from "date-fns"

export const timeDiff = (time: string) => {
    return formatDistance(
        new Date(time),
        addMinutes(
            new Date(),
            new Date().getTimezoneOffset()
        ),
        {includeSeconds: true}
    )
}
