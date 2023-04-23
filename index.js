const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')
const core = require('@actions/core');
const github = require('@actions/github');

try {
    // Get all inputs
    const instanceUrl = core.getInput('instance_url')
    const accessToken = core.getInput('access_token')
    const appBundleId = core.getInput('app_bundle_id')
    const appVersion = core.getInput('app_version')
    const releaseChannel = core.getInput('release_channel')
    const versionDescription = core.getMultilineInput('version_description')
    const publish = core.getBooleanInput('publish')
    const appFilePath = core.getInput('app_file')

    // Build the webhook url
    const url = `${instanceUrl}/api/webhook/apps/${appBundleId}/version/${appVersion}`

    // Create the form data with the file...
    var formData = new FormData()
    formData.append("file", fs.createReadStream(appFilePath))

    // ... and other information
    if (releaseChannel) {
        formData.append("release_channel", releaseChannel)
    }
    if (versionDescription) {
        formData.append("version_description", versionDescription)
    }
    formData.append("publish", publish)

    // Set the authorization header
    const requestConfig = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            ...formData.getHeaders()
        }
    }

    // Upload the data
    await axios.post(url, formData, requestConfig)

} catch (error) {
    // Something went wrong, report the error.
    core.setFailed(error.message)
}