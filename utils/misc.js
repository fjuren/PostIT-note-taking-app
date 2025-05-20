// converts a tag object {value: 'tagname'} to just the tag value
const getTagValues = (rawTags) => {
    // handles case where no tags are added to a note 
        if (!rawTags) return
        return JSON.parse(rawTags).map(tags => tags.value.toLowerCase())
}

module.exports = {
    getTagValues
}