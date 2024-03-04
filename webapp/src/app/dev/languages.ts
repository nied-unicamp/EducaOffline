export const LANGUAGE = {
  moduleNames: {
    activities: 'Activities',
    calendar: 'Calendar',
    grades: 'Grades',
    groups: 'Groups',
    material: 'Support Material',
    profile: 'Profile',
    repository: 'Repository',
    wall: 'Timeline',
    members: 'Members'
  },
  activities: {
    ActivitiesComponent: {
      answer: 'Answer',
      share: 'Share',
      resolutions: 'Resolutions'
    },
    ActivitiesItemComponent: {
      hasAttachments: 'attachments',
      noAttachments: 'No attachments',
      publicationIn: 'Publication in',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      deleteWarning: 'This action cannot be undone.',
      forEvaluation: 'Worth a grade',
      notEvaluation: 'Not worth a grade',
      messageEditDisabled: 'The activity cannot be edited because submission period has already started',
      statusText: {
        forTeachers: {
          scheduled: 'Scheduled activity',
          scheduledClosed: 'Scheduled for',
          published: 'Published activity',
          submissionPeriod: 'Awaiting submissions',
          submissionPeriodClosed: 'Submissions until',
          evaluationPeriod: 'Awaiting correction',
          evaluationPeriodClosed: 'Correction available',
          evaluated: 'Released notes'
        },
        forStudents: {
          published: 'Viewing available',
          publishedClosed: 'View activity',
          submissionPeriod: 'Awaiting submission',
          submissionPeriodClosed: 'Deliver by',
          submitted: 'Submitted activity',
          evaluationPeriod: 'In correction',
          evaluationNotSubmitted: 'Submission period closed',
          evaluationPeriodClosed: 'Awaiting correction',
          evaluated: 'Grade available'
        }
      }
    },
    ActivitiesFolderComponent: {
      erase: 'Delete activity',
      edit: 'Edit activity'
    },
    ActivitiesCreateComponent: {
      title: 'Describe the activity',
      titlePH: 'Title',
      descriptionPH: 'Describe',
      studentSendFiles: 'Student will send files',
      hasGrade: 'Worth a grade',
      evaluationCriteriaPH: 'Evaluation Criteria',
      submit: 'Create activity',
      cancel: 'Cancel',
      saveEdit: 'Save Changes',
      validationMessages: {
        title: {
          required: 'Title required.'
        },
        description: {
          required: 'Description required.'
        },
        submissionStartDate: {
          required: 'Start date of submission period is required'
        },
        submissionEndDate: {
          required: 'End date of submission period is required'
        }
      }
    },
    ActivitiesDescriptionComponent: {
      pointer: 'Tasks',
      descriptionBack: 'Back to tasks',
      submission: 'Submission period',
      to: 'to',
      forEvaluation: 'Worth a grade',
      notEvaluation: 'Not worth a grade',
      criterion: 'Evaluation criterion',
      description: 'Description',
      published: 'Published in',
      edit: 'Edit',
      delete: 'Delete',
      gradeReleased: 'Grade released on',
      evaluation: 'Awaiting evaluation and release of the grade.'
    },
    ActivitiesSubmissionCreateComponent: {
      modalButton: 'Submit',
      title: 'Activity submission',
      comment: 'Write your answer here.',
      commentLabel: 'Comments: ',
      cancel: 'Cancel',
      submit: 'Submit',
      save: 'Save'
    },

    ActivitiesSubmissionComponent: {
      modalButton: 'View',
      title: 'Activity answer',
      comment: 'Comments and observations.',
      commentLabel: 'Student comments: ',
      cancel: 'Cancel',
      submit: 'Submit',
      edit: 'Edit',
      submissionEndedMessage: 'Submission period closed on ',
      submission: 'Submission',
      notSubmitted: 'Unsubmitted activity.',
      submissionEndMessageA: 'Submission period closed on',
      submissionEndMessageB: 'at',
      submissionPreMessageA: 'It will be possible to make your submission in the submission period ',
      submissionPreMessageB: 'at ',
      submissionPreMessageC: ').',
      gradeReleased: 'The activity has been corrected and the grade is available in notes.',
      submissionMessage: 'You can edit your submission until the end of the submission period'
    },
    ActivitiesEvaluateComponent: {
      modalButton: 'Correct',
      evaluateModal: 'Correct activity.',
      grade: 'grade',
      scoreLabel: 'grade: ',
      comment: 'Comments and observations.',
      answer: 'Student submission: ',
      noAnswer: 'Submission was not performed.',
      commentLabel: 'Comments: ',
      cancel: 'Cancel',
      submit: 'Submit'
    },
    ActivitiesFilterComponent: {
      filter: 'Filter',
      options: {
        NoFilter: 'No filter',
        Evaluated: 'Evaluated',
        ToEvaluate: 'To be evaluated',
        ToDo: 'To be done',
        Done: 'Done',
        Ended: 'Ended'
      }
    },
    ActivitiesSubmissionsListComponent: {
      filter: 'Filterr',
      filterBy: 'Filter by',
      name: 'Name',
      grade: 'grade',
      status: 'Status',
      action: 'Action',
      evaluated: 'Evaluated',
      submitted: 'Submitted',
      notSubmitted: 'Not submitted',
      options: {
        NoFilter: 'No filter',
        Submitted: 'Submitted',
        NotSubmitted: 'Not submitted',
        Evaluated: 'Evaluated',
        ToEvaluate: 'To be evaluated'
      }
    },
    ActivitiesListStudentsComponent: {
      filter: 'Filter',
      filterBy: 'Filter by',
      name: 'Students',
      grades: 'Notes',
      submission: 'Submission',
      submissions: 'Submissions',
      evaluated: 'Evaluated',
      submitted: 'Submitted',
      submittedNone: 'Not submitted',
      submissionsNone: 'No submissions',
      submissionsDate: 'Submission date',
      notSubmitted: 'Not sent',
      evaluation: 'Evaluate submissions',
      evaluateModal: 'Evaluate submission',
      release: 'Release notes',
      releaseWarning: 'When releasing grades you can assign a ZERO grade to all students who have not made a submission.',
      released: 'Notes released on ',
      seeAndEvaluate: 'View and Evaluate',
      evaluate: 'Evaluate',
      hasComment: 'Contains commentary',
      hasNotComment: 'Contains no commentary',
      score: 'grade:',
      comment: 'Teacher comment:',
      close: 'Close',
      notSubmittedExclamation: 'The student did not send the activity.',
      submissionsOver: 'No more submissions to be evaluated.',
      submittedAll: 'All Students submitted the activity',
      submissionPreMessageA: 'Listed students may submit during the submission period (',
      submissionPreMessageB: 'to ',
      submissionPreMessageC: ').',
      options: {
        NoFilter: 'No filter',
        Submitted: 'Sent to',
        NotSubmitted: 'Not sent',
        Evaluated: 'Evaluated',
        ToEvaluate: 'To be evaluated'
      }
    },
    ActivitiesMenuComponent: {
      create: 'Create activity',
      createSm: 'Create',
      trash: 'Open trash',
      trashSm: 'Trash'
    },
    ActivitiesTrashComponent: {
      title: 'Activuty trash',
      goBack: 'Back to activities',
      goBackSm: 'Back',
      cleanTrash: 'Clean trash',
      restoreAll: 'Restore all activities',
      cleanTrashSm: 'Clear',
      restoreAllSm: 'Restore'
    },
    ActivitiesSortComponent: {
      sort: 'Sort',
      options: {
        Newer: 'Most recent',
        LastModified: 'Recently modified',
        Older: 'Older'
      }
    },
    ActivitySharedComponent: {
      fullShared: 'Full shared',
      sharedWithTrainers: 'Share with Trainers',
      noShared: 'Not shared'
    }
  },
  calendar: {
    CalendarComponent: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      eventsTitle: 'Events on the day',
      ends: 'Ends',
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthsSm: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
    }
  },
  course: {
    CourseComponent: {

    },
    LeftMenuComponent: {
      courses: 'Courses',
      wall: 'Timeline',
      materials: 'Course Material',
      activities: 'Activities',
      grades: 'Grades',
      participants: 'Participants',
      calendar: 'Calendar',
      performance: 'Performance',
      admins: 'Administrators'
    },
    TabComponent: {
      wall: 'Timeline',
      tasks: 'Tasks',
      people: 'People',
      groups: 'Groups'
    }
  },
  courseEdit: {

  },
  courseRegister: {
    CourseRegisterComponent: {
      courseRegister: 'Register course'
    },
    CourseRegisterFormComponent: {
      title: 'Course register',
      name: 'Course Name',
      namePH: 'Course Name',
      info: 'Course Information',
      infoPH: 'Course Information',
      subsBegin: 'Start of course registration',
      subsEnd: 'End of course registration',
      courseBegin: 'Course start',
      courseEnd: 'End of Course',
      numberStudents: 'Maximum number of students',
      teacherEmail: 'Teacher\'s e-mail',
      submit: 'Send',
      goBack: 'Go back',
      communicating: 'Communicating with the server...',
      update: 'Update course informations',
      updateSucess: "Course information update successfully.",
      updateError: "Could not update course information.",
      tryAgain: "Try again",
      errorMessages: {
        subscriptionDate : "Subscription begin date must be before the end date",
        courseDate: "Course start date must be before the end date"
      },
      validationMessages: {
        courseName: {
          required: 'Name of the required course.'
        },
        info: {
          required: 'Required Information.'
        },
        subscriptionBegin: {
          required: 'Registration start date is required.'
        },
        subscriptionEnd: {
          required: 'End date of registration is required.'
        },
        startDate: {
          required: 'Course start date is required.'
        },
        endDate: {
          required: 'End Course date is required.'
        },
        noMaxStudents: {
          required: 'Maximum number of students is required to create a course.'
        },
        teacherEmail: {
          required: 'A course must have a teacher with valid e-mail.',
          email: 'Invalid e-mail.'
        }
      }
    },
    CourseRegisterResponseComponent: {
      teacherEmail: 'Teacher e-mail:',
      error: {
        error: 'Error:',
        userNotFoundMessage: 'The user you put as a teacher was not found.',
        tryAgain: 'Try again',
        message: 'Courser registration failed.'
      },
      noError: {
        courseName: 'Course name: ',
        teacherName: 'Teacher name: ',
        message: 'Registration was successful!',
        goBack: "Go back.",
        copyToclipBoard: "Copy informations to clipboard",
        detaliedInformation: 'Detailed information',
        startRegister : 'Start of course registration:',
        endRegister: 'End of course registration:',
        startCourse: 'Course start:',
        endCourse: 'End of Course:',
        maxEstudents: 'Maximum number of students:',
        courseId: "Course id:",
        copied: "copied!"
      }
    }
  },
  grades: {
    GradesPersonalComponent: {
      activities: 'Activities',
      activitiesList: 'Course activities',
      evaluatedActivities: 'Evaluted activities',
      notEvaluatedActivities: 'Activities not evaluated',
      notEvaluated: 'Not Evaluated',
      notGraded: 'Not worth a grade',
      currentGrade: 'Partial average',
      scoreStudent: 'Individual score',
      score: 'Score:',
      comment: 'Teacher comment:',
      activitiesNull: 'There is no activity to display',
      submitted: 'Submitted',
      notSubmitted: 'Not submitted',
      submitting: 'Already submitted',
      notSubmitting: 'Not submitted yet',

      seeDetails: 'Average Details',

      scoreCourse: 'Class score',
      hasComment: 'Contains commentary',
      hasNotComment: 'No comment',
      mediaNull: '0',

      gradedActivities: 'Graded Assessments',
      practiceActivities: 'Practice Activities',

      notesNotReleased: 'Notes not released yet'
    },
    GradesCourseComponent: {
      students: 'Students',
      activities: 'Activities',
      notEvaluated: 'Not evaluated',
      gradeWeight: 'Weight',
      media: 'Class average',
      scoreStudent: 'Avarege',
      scoreEdit: 'Edit',
      notSubmitted: 'The student did not submit',
      notGraded: 'Not worth a grade',
      submitted: 'Submitted',
      submitting: 'Already submitted',
      notSubmitting: 'Not submitted yet',
      averageTitle: 'Update Avarage Calculation',
      studentNull: 'No students enrolled',
      evaluatedActivities: 'Activities with released grades',
      notEvaluatedActivities: 'Activities without released grades',
      futureActivities: 'Future activities',
      activitiesNull: 'There are no activities to display',
      usersNull: 'There are no students registered in the course',
      gradesNull: 'There are no notes to be displayed',
    },
    GradesEditWeightComponent: {

      activities: 'Activities',
      gradeWeight: 'Weight',
      defaultWeight: 'Standard weight for new activities',
      totalWeight: 'Sum of the weights',
      addWeight: 'Assign weight',
      sameWeight: 'Assign equal weight',
      weightWarning1: 'ATTENTION! With',
      weightWarning2: ' "Assign equal weight"',
      weightWarning3: ' activated, all activities will have their weight set to 1 (including the ones created from now on) making the average a simple arithmetic mean.',
      pubUpdate: 'Announce update on the wall',
      activityNonSetWeight: 'Weight of non-registered activities',
      scoreEdit: 'Edit',
      averageTitle: 'Weighted Average Calculation',
      studentNull: 'No students enrolled',
      activitiesNull: 'There are no activities to display',
      usersNull: 'There are no students registered in the course',
      gradesNull: 'There are no notes to be displayed',
      btnClose: 'Close',
      btnSave: 'Save',

      weightedAvarageExplanation: 'The average is calculated using a weighted approach, where the weights of each activity can be seen below.',
      arithmeticAvarageExplanation: 'The average is arithmetic, with all activities having equal weight in the final average.'
    }
  },
  home: {
    HomeComponent: {
      myCourses: 'My Courses',
      enterCourse: 'Enter a course',
      filterName: 'Name',
      filterCreatedDate: 'Creation date',
      filterEnrolledAsStudent: 'Registered as a student',
      filterEnrolledAsTeacher: 'Registered as a teacher',
      filterAll: 'All',
      endedCourses: "Ended courses",
      activeCourses: "Active courses",
      sortName: 'Name',
      sortCreationDate: 'Creation Date'
    },
    HomeCourseViewComponent: {
      seeMoreInformation: 'View course information',
      noActivities: 'No events in the next 15 days',
      activities: 'events in the next 15 days',
      prof: 'Prof',
      addParticipant: 'Add Participant'
    },
    HomeCoursesComponent: {
      previousCourses: 'Previous courses'
    },
    HomeUserMenu: {
      calendar: 'Calendar',
      notices: 'News',
      forum: 'Forum',
      logOut: 'Log out'
    },
    HomeEnterComponent: {
      addKey: 'Add the course access key that your teacher has shared with you into the field.',
      logIn: 'Log in',
      accessKey: 'Access key',
      invalid: 'invalid',
      cancel: 'Cancel',
      confirm: 'Confirm'
    },
    offlineNotification: {
      offlineAlert: 'You are offline',
      offlineSyncWarning: 'You are offline. Synchronization required!'
    },
    offlineWarning: {
      title: 'Warning - You are offline!',
      base: "If you leave now you won't be able to access the page until your connection is restored. By staying you can continue on working with all features available offline until then.",
      ifHasToSync: 'There are changes waiting to be synchronized; they will be lost if you leave.'
    }
  },
  admin: {
    AdminComponent: {

    },
    AdminViewComponent: {
      upcomingTasks: 'Next activities'
    },
    AdminPanelComponent: {
      previousCourses: 'Past courses'
    },
    AdminListComponent: {
      name: 'Name',
      edit: 'Edit',
      erase: 'Delete',
      administrators: 'Administrators'
    },
    AdminListCoursesComponent: {
      courses: 'Courses',
      deleteError: "The removal of this course was unsuccessful. The course is not empty.",
      error: "Error",
      close: "Close.",
      updateCourse: "Updade course information."
    }
  },
  login: {
    LoginComponent: {
      email: 'E-mail',
      emailPH: 'Enter your e-mail here.',
      password: 'Password',
      passwordPH: 'Enter your password here.',
      login: 'Enter',
      notRegistered: 'You are new here?',
      register: 'Register',
      forgotPassword: 'Forgot Password?',
      loginError: 'Invalid e-mail or password. Please try again.',
      validationMessages: {
        email: 'Invalid e-mail.',
        password: 'Must contain at least 8 characters.'
      },
      registerOK: 'Registration complete! Please log in below with your password.'
    },
    LoginForgotPasswordComponent: {
      forgotPassword: 'Forgot Password?',
      email: 'E-mail',
      emailPH: 'Enter here your registered e-mail.',
      errorMessage: 'Invalid e-mail. Please try again.',
      successMessage: 'Email sent successfully!',
      message: 'We will send you in your e-mail the link to reset your password. Click it and register your new password.',
      cancel: 'Cancel',
      conclude: 'Conclude'
    },
    LoginChangePasswordComponent: {
      changePassword: 'Change Password',
      password: 'New Password',
      passwordPH: 'Enter your new password here.',
      repeatPassword: 'Repeat new password',
      repeatPasswordPH: 'Repeat your new password here.',
      validationMessages: {
        password: 'Must contain at least 8 characters.',
        repeatPassword: 'Passwords are different.',
        repeatPasswordOK: 'The passwords are the same.'
      },
      conclude: 'Conclude',
      passwordChanged: 'Password changed successfully! Please wait and you will be redirected to the home page...'
    }
  },
  material: {
    general: {
      link: 'Link',
      file: 'File',
      folder: 'Folder'
    },
    MaterialMenuComponent: {
      createFolder: 'Create Folder',
      createLink: 'Create Link',
      uploadFile: 'Upload File'
    },
    MaterialDropdownComponent: {
      link: {
        edit: 'Edit Link',
        move: 'Move Link',
        delete: 'Delete Link'
      },
      file: {
        move: 'Move File',
        delete: 'Delete File'
      },
      folder: {
        edit: 'Edit Folder',
        delete: 'Delete Folder',
        download: 'Download Folder'
      },
      folderHasItems: "This folder cannot be deleted because it contains materials."
    },
    MaterialMoveComponent: {
      folder: 'Folder',
      rootName: '(Root Directory)',
      cancel: 'Cancel',
      submit: 'Submit'
    },
    MaterialCreateLinkComponent: {
      link: 'Link',
      linkPH: 'Insert the link',
      title: 'Title',
      titlePH: 'Enter a title to represent the link',
      modalTitle: 'Create Link',
      cancel: 'Cancel',
      submit: 'Submit',
      validationMessages: {
        title: {
          required: 'Title required.',
          minlength: 'Invalid title (too short).'
        },
        link: {
          required: 'The link is required',
          pattern: 'Invalid link'
        }
      }
    },
    MaterialCreateFolderComponent: {
      title: 'Folder Name',
      titlePH: 'Enter the name of the folder here',
      description: 'Folder Description',
      descriptionPH: 'Enter the description of the folder here',
      modalTitle: 'Create Folder',
      folderDownloadButtonTitle: 'Download Folder',
      cancel: 'Cancel',
      submit: 'Submit',
      validationMessages: {
        title: {
          required: 'Title required.',
          maxlength: 'Invalid title (too long).'
        },
        description: {
          maxlength: 'Invalid description (too long).'
        },
      }
    }
  },
  people: {
    AddModalComponent: {
      addPerson: 'Add People',
      add: 'Add'
    },
    PeopleComponent: {

    },
    PeopleFormComponent: {
      name: 'Name',
      lastName: 'Last name',
      login: 'Login',
      email: 'Email',
      submit: 'Send',
      newUser: 'New user'
    },
    PutModalComponent: {
      changeUser: 'Change User'
    },
    SubmittedComponent: {
      addPersonMessage: 'You have added the following person',
      name: 'Name',
      lastName: 'Last name',
      login: 'Login',
      email: 'Email'
    }
  },
  profile: {
    ProfilePersonalDataEditComponent: {
      aboutMe: 'Short Bibliography',
      aboutMeErrorMaxNumChars: 'Must contain no more than 1,000 characters.',
      aboutMeHelp1: 'Use up to 1,000 characters.',
      aboutMeHelp2: 'Have already been used: ',
      fullName: 'Full name',
      nameRequired: 'It cannot be empty.',
      nameErrorMaxNumChars: 'Must contain a maximum of 100 characters.',
      nameHelp: 'Use up to 100 characters.',
    },
    ProfilePasswordEditComponent: {
      email: 'E-mail',
      infoAccount: 'Account information',
      editPassword: 'Change password',
      oldPassword: 'Current password',
      newPassword: 'New password',
      repeatPassword: 'Repeat new password',
      equalPasswd: 'The passwords are the same.',
      differentPasswd: 'Passwords are different.',
      mustContain: 'It must contain at least ',
      char: ' characters.',
      oldPasswordDoNotMatch: 'Incorrect password.'
    },
    ProfileCoursesComponent: {
      enrolledAsATeacher: 'Enrolled as a teacher',
      enrolledAsAStudent: 'Enrolled as a student',
    },
    ProfilePersonalDataComponent: {
      editPassword: 'Edit password',
      edit: 'Edit'
    },
    actions: {
      edit: 'Edit Profile',
      update: 'Update',
      confirm: 'Confirm',
      save: 'Save',
      cancel: 'Cancel',
      editPassword: 'Change Password'
    }
  },
  register: {
    RegisterComponent: {
      register: 'Register',
      name: 'Name',
      namePH: 'Enter your name here.',
      email: 'E-mail',
      emailPH: 'Enter your email here.',
      password: 'Password',
      passwordPH: 'Enter your password here.',
      repeat_password: 'Repeat password',
      repeat_passwordPH: 'Repeat your password here.',
      message: 'We will send you a link in your e-mail to confirm your registration. Click on it and access our platform!',
      conclude: 'Conclude',
      alreadyRegistered: 'You are already registered?',
      accessAccount: 'Account Login',
      validationMessages: {
        name: 'It cannot be empty.',
        email: 'Invalid e-mail.',
        password: 'Must contain 8 characters.',
        repeat_password: 'Passwords are different.',
        repeat_passwordOK: 'The passwords are the same.'
      },
      registerOK: 'Initial registration successfully completed! Check your e-mail and click on the indicated link to confirm it.'
    }
  },
  repository: {
    RepositoryComponent: {

    }
  },
  shared: {
    CreateFolderComponent: {
      create: 'Create folder',
      createSm: 'Create',
      folderName: 'Folder Name',
      folderNamePH: 'Enter the name of the new folder here',
      modalTitle: 'Create folder',
      cancel: 'Cancel',
      submit: 'Create',
      adding: 'Adding Folder...',
      error: 'Unable to add folder',
      validationMessages: {
        name: {
          required: 'Name required.',
          minlength: 'Name must be at least 4 characters.',
          maxlength: 'Name cannot be longer than 24 characters.',
        },
        path: {
          required: 'Necessary path.'
        }
      }
    },
    DateSelectComponent: {
      at: 'at'
    },
    ModalFormComponent: {
      title: 'Complete the form'
    },
    ConfirmDeleteComponent: {
      title: 'Confirm exclusion',
      confirmAction: "Confirm this action",
      questionDelete: `Do you truly wish to delete this activity? This action is irreversible, and the information cannot be restored.`,
      questionCancel: `Do you really want to cancel this activity? This action is irreversible and the information cannot be restored.
                      Upon confirmation, students will be notified of the cancellation on the wall.`,
      questionGradesReleased: `Do you really want to release grades of this activity? This action is irreversible.
                      Upon confirmation, students will be notified of the release on the wall.`,
      confirm: "Confirm",
      cancel: "Cancel"
    },
    FileItemComponent: {
      download: 'Download'
    },
    FileListComponent: {
      files: 'Files',
      undo: 'Undo',
      removeAll: 'Remove All',
      noFile: 'There are no attached files.',
      noFileSelected: 'No files were selected.'
    },
    FileUploadComponent: {
      addFile: 'Attach',
      dropFiles: 'Drag and drop files here',
      files: 'Files',
      undo: 'Undo',
      removeAll: 'Remove all',
      noFile: 'There are no attached files.',
      noFileSelected: 'No files were selected.'
    },
    PublicationDateComponent: {
      title: 'Publication Date',
      publishNow: 'Publish now',
      chooseDate: 'Schedule publication',
      saveDraft: 'Save draft'
    },
    SubmissionDateComponent: {
      title: 'Submission Period',
      start: 'Start',
      end: 'End'
    },
    translateButton: {
      english: 'English (EN)',
      portuguese: 'Portuguese (PT-BR)'
    },
    time: {
      at: 'at'
    }
  },
  wall: {
    WallCreateComponent: {
      typeYourPost: 'Type your post here...',
      textHelp1: 'Use up to 1,000 characters.',
      textHelp2: 'They have already been used: ',
      publish: 'Publish'
    },
    WallPostComponent: {
      newActivity: 'A new activity has been published.',
      canceledActivity: 'An activity has been canceled.',
      gradesReleased: 'An activity grade have been released',
      averageUpdate: 'Average calculation/weights updated',
      averageUpdateExplain: 'The calculation method or weights of the activities have been updated. Check out the grades page to see details.',
      pin: 'Fix',
      unpin: 'Unfix',
      edit: 'Edit',
      delete: 'Delete',
      readMore: 'READ MORE...',
      activityPost: {
        title1: 'The Activity',
        title2: 'was published',
        title3: 'was canceled',
        title4: 'The grades for the activity',
        title5: 'have been released',
        dates: 'It will be possible to make your submission in the period between',
        atHours: 'at',
        untilDate: 'until',
        graded: 'This activity is worth a grade'
      }
    },
    WallItemComponent: {
      oldComments: 'View Older Comments'
    },
    WallCommentComponent: {
      edit: 'Edit',
      delete: 'Delete',
      readMore: 'READ MORE...',
      addReply: 'Add reply',
    },
    WallCommentCreateComponent: {
      typeYourComment: 'Type your comment here...',
      error: 'Use up to 1,000 characters.',
      comment: 'Comment'
    },
    WallCommentReplyCreateComponent: {
      typeYourReply: 'Type your reply to the comment here...',
      error: 'Use up to 1,000 characters.',
      addReply: 'Add reply',
      submit: 'Submit'
    },
    WallCommentReplyComponent: {
      typeYourComment: 'Type your comment here...',
      error: 'Use up to 1,000 characters.',
      addReply: 'Add reply',
      submit: 'Submit',
      readMore: 'READ MORE...',
      edit: 'Edit',
      delete: 'Delete'
    }
  },
  members: {
    MembersComponent: {
      addParticipant: 'Add Participant',
      all: 'All',
      teachers: 'Teachers',
      students: 'Students',
      admins: 'Administrators',
      name: 'Name'
    },
    MembersAddComponent: {
      shareKey: 'Share this key with your students so they can enter your course.',
      generateKey: 'Generate new key',
      warning: 'Warning! When replacing the course access key, the previous key will be permanently disabled!',
      close: 'Close'
    },
    MembersItemComponent: {
      lastAccess: 'Last Access:',
      teacher: 'Teacher',
      student: 'Student',
      admin: 'Administrator'
    }
  }
};
