
## Description

A Typescript and Javascript client for interfacing with the official [SCORM Cloud API](https://rusticisoftware.com/products/scorm-cloud/)

An technical overview of the API and it's related services can be found at : [API Overview](https://cloud.scorm.com/docs/v2/reference/api_overview)

*Note:* This client is in the early stages of development and not all official endpoints are implemented yet. Currently, the endpoints covered by the 
["Getting Started"](https://cloud.scorm.com/docs/v2/tutorials/course_registration_launch/) tutorial are available for use, along with some additional ones. 
The tutorial can therefore be completed with this client in it's current state (as shown by the integration tests). 

*Current status:* Please refer to the [reference documentation for this client](https://distributhor.github.io/scormcloud-client/index.html), which will always 
reflect the latest development. The [coverage](#coverage) section below will be kept up to date, in order to give a bird's eye view of the state of coverage of the
endpoints of the official API.


<br/>

## Usage

 ```ts
 import { ScormClient } from 'scorm-client'
 
 const client = new ScormClient(appId, secretKey, "read")
 
 // will fetch a course using a token with the default scope, in this case 'read'
 const course: Course = await client.getCourse(courseId)
 
 // will delete a course using a token with 'write' scope
 const result: SuccessIndicator = await client.deleteCourse(courseId, { scope: 'write' })
 ```

For more details, see the reference documentation below

<br/>

## Documentation

[The API reference documentation for this client](https://distributhor.github.io/scormcloud-client/classes/client.ScormClient.html)


<br/>

## Coverage

The complete list of endpoint methods exposed by the official API can be found at : [API Method Reference](https://cloud.scorm.com/docs/v2/reference/swagger/)

The following list indicates which of these endpoints are currently covered by functionality of this client.

<br/>

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
- [ ] BuildCoursePreviewLaunchLink
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
- [x] GetCourseVersions
- [ ] GetCourseVersionInfo
- [x] DeleteCourseVersion
- [ ] BuildCoursePreviewLaunchLinkWithVersion
- [ ] GetVersionedCourseZip
- [ ] GetCourseVersionAsset
- [ ] ImportCourseVersionAssetFile
- [ ] DeleteCourseVersionAsset
- [x] UploadCourseVersionAssetFile
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
- [x] BuildRegistrationLaunchLink
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
