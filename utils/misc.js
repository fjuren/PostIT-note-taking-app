// converts a tag object {value: 'tagname'} to just the tag value
const getTagValues = (rawTags) => {
        return JSON.parse(rawTags).map(tags => tags.value)
}

module.exports = {
    getTagValues
}