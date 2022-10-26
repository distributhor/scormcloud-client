
## Description

A Typescript and Javascript client for interfacing with the [Scorm Cloud API](https://rusticisoftware.com/products/scorm-cloud/)

*Note: This is currently in early stages of development and not ready for production use yet*

*Current status:* At the moment the endpoints covered in the official ["Getting Started"](https://cloud.scorm.com/docs/v2/tutorials/course_registration_launch/) tutorial have been implemented, although not with all the optional settings that are available. The TS typings have also not been fully expanded yet. Having said that, the actions taken in the tutorial can already implemented with this client in it's current state (as shown by the integration tests) - it is functional, just very limited in the scope of which endpoints and optional settings have been implemented, out of all those available. 

*To know the current state of implementation*, please refer to the [reference documentation for this client](https://distributhor.github.io/scormcloud-client/index.html), which will always reflect the latest state. The [coverage](#coverage) section below will also be kept up to date, in order to give a bird's eye view.

<br/>

## Documentation

[The API reference documentation for the client](https://distributhor.github.io/scormcloud-client/index.html)

<br/>

## Coverage

The following indicates which of the endpoints in the [official API](https://cloud.scorm.com/docs/v2/reference/swagger/) is currently covered by functionality of this client.

#### Authentication Service

- [x] GetAppToken

#### Ping Service

- [x] PingAppId


#### Course Service

- [x] GetCourses
- [x] CreateUploadAndImportCourseJob
- [ ] CreateNoUploadAndImportCourseJob
- [ ] CreateFetchAndImportCourseJob
- [x] GetImportJobStatus
- [x] GetCourse
- [x] DeleteCourse
- [x] SetCourseTitle
- [x] BuildCoursePreviewLaunchLink
- [ ] GetCourseZip
- [ ] UploadCourseAssetFile
- [ ] ImportCourseAssetFile
- [ ] GetCourseAsset
- [ ] DeleteCourseAsset
- [ ] GetCourseFileList
- [ ] GetCourseConfiguration
- [ ] SetCourseConfiguration
- [ ] DeleteCourseConfigurationSetting
- [ ] PutCourseTagsBatch
- [ ] PutCourseTags
- [ ] GetCourseTags
- [ ] DeleteCourseTags
- [ ] GetCourseStatements
- [ ] GetCourseVersions
- [ ] GetCourseVersionInfo
- [ ] DeleteCourseVersion
- [ ] BuildCoursePreviewLaunchLinkWithVersion
- [ ] GetVersionedCourseZip
- [ ] GetCourseVersionAsset
- [ ] ImportCourseVersionAssetFile
- [ ] DeleteCourseVersionAsset
- [ ] UploadCourseVersionAssetFile
- [ ] GetCourseVersionFileList
- [ ] GetCourseVersionConfiguration
- [ ] SetCourseVersionConfiguration
- [ ] DeleteCourseVersionConfigurationSetting
- [ ] GetCourseVersionStatements


#### Registration Service

- [x] GetRegistrations
- [x] CreateRegistration
- [x] GetRegistration
- [x] GetRegistrationProgress
- [x] DeleteRegistration
- [ ] GetRegistrationConfiguration
- [ ] SetRegistrationConfiguration
- [ ] DeleteRegistrationConfigurationSetting
- [ ] BuildRegistrationLaunchLink
- [ ] GetRegistrationLaunchHistory
- [ ] DeleteRegistrationProgress
- [ ] DeleteRegistrationGlobalData
- [ ] PutRegistrationTagsBatch
- [ ] PutRegistrationTags
- [ ] GetRegistrationTags
- [ ] DeleteRegistrationTags
- [ ] GetRegistrationStatements
- [ ] TestRegistrationPostback
- [ ] GetRegistrationInstances
- [ ] CreateNewRegistrationInstance
- [ ] GetRegistrationInstanceProgress
- [ ] DeleteRegistrationInstance
- [ ] GetRegistrationInstanceConfiguration
- [ ] SetRegistrationInstanceConfiguration
- [ ] DeleteRegistrationInstanceConfigurationSetting
- [ ] GetRegistrationInstanceLaunchHistory
- [ ] GetRegistrationInstanceStatements


#### Learner Service

- [ ] UpdateLearnerInfo
- [ ] DeleteAllLearnerData
- [ ] PutLearnerTagsBatch
- [ ] PutLearnerTags
- [ ] GetLearnerTags
- [ ] DeleteLearnerTags


#### Not currently in scope

- Reporting Service
- Application Management Service
- Dispatch Service
- Invitations Service
