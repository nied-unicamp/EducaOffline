export const LANGUAGE_PT = {
  moduleNames: {
    activities: 'Atividades',
    calendar: 'Calendário',
    grades: 'Notas',
    groups: 'Grupos',
    material: 'Material de Apoio',
    profile: 'Perfil',
    repository: 'Repositório',
    wall: 'Mural',
    members: 'Participantes'
  },
  activities: {
    ActivitiesComponent: {
      answer: 'Responder',
      share: 'Compartilhar',
      resolutions: 'Resoluções'
    },
    ActivitiesItemComponent: {
      hasAttachments: 'anexos',
      noAttachments: 'Nenhum anexo',
      publicationIn: 'Publicação em',
      edit: 'Editar',
      delete: 'Apagar',
      cancel: 'Cancelar',
      deleteWarning: 'Esta ação não poderá ser desfeita.',
      forEvaluation: 'Vale nota',
      notEvaluation: 'Não vale nota',
      messageEditDisabled: 'A atividade não pode ser editada porque o período de envio já começou',
      statusText: {
        forTeachers: {
          scheduled: 'Atividade agendada',
          scheduledClosed: 'Agendada para',
          published: 'Atividade publicada',
          submissionPeriod: 'Aguardando submissões',
          submissionPeriodClosed: 'Submissões até',
          evaluationPeriod: 'Aguardando correção',
          evaluationPeriodClosed: 'Correção disponível',
          evaluated: 'Notas liberadas'
        },
        forStudents: {
          published: 'Visualização disponível',
          publishedClosed: 'Ver atividade',
          submissionPeriod: 'Aguardando submissão',
          submissionPeriodClosed: 'Entregar até',
          submitted: 'Atividade submetida',
          evaluationPeriod: 'Em correção',
          evaluationNotSubmitted: 'Período de submissão encerrado',
          evaluationPeriodClosed: 'Aguardando correção',
          evaluated: 'Nota disponível'
        }
      }
    },
    ActivitiesFolderComponent: {
      erase: 'Apagar atividade',
      edit: 'Editar atividade'
    },
    ActivitiesCreateComponent: {
      title: 'Descreva a atividade',
      titlePH: 'Título',
      descriptionPH: 'Descrição',
      studentSendFiles: 'Aluno enviará arquivos',
      hasGrade: 'Vale nota',
      evaluationCriteriaPH: 'Critérios de avaliação',
      submit: 'Criar atividade',
      cancel: 'Cancelar',
      saveEdit: 'Salvar mudanças',
      validationMessages: {
        title: {
          required: 'Título necessário.'
        },
        description: {
          required: 'Descrição necessária.'
        },
        submissionStartDate: {
          required: 'Data de início do período de submissão é necessária'
        },
        submissionEndDate: {
          required: 'Data de término do período de submissão é necessária'
        }
      }
    },
    ActivitiesDescriptionComponent: {
      pointer: 'Tarefas',
      descriptionBack: 'Voltar',
      submission: 'Período de submissão de',
      to: 'até',
      forEvaluation: 'Vale nota',
      notEvaluation: 'Não vale nota',
      criterion: 'Critério de avaliação',
      description: 'Descrição',
      published: 'Publicação em',
      edit: 'Editar',
      delete: 'Apagar',
      gradeReleased: 'Nota Liberada em',
      evaluation: 'Aguardando avaliação e liberação da nota.'
    },
    ActivitiesSubmissionCreateComponent: {
      modalButton: 'Submeter',
      title: 'Submissão da Atividade',
      comment: 'Escreva sua resposta aqui.',
      commentLabel: 'Comentários: ',
      cancel: 'Cancelar',
      submit: 'Enviar',
      save: 'Salvar'
    },

    ActivitiesSubmissionComponent: {
      modalButton: 'Visualizar',
      title: 'Resposta da Atividade',
      comment: 'Comentários e observações.',
      commentLabel: 'Comentários do aluno: ',
      cancel: 'Cancelar',
      submit: 'Enviar',
      edit: 'Editar',
      submissionEndedMessage: 'Período de submissão encerrado em ',
      submission: 'Submissão',
      notSubmitted: 'Atividade não submetida.',
      submissionEndMessageA: 'Período de submissão Encerrado em',
      submissionEndMessageB: 'às',
      submissionPreMessageA: 'Será possível fazer sua submissão no período de submissão (',
      submissionPreMessageB: 'até ',
      submissionPreMessageC: ').',
      gradeReleased: 'A atividade foi corrigida e a nota está disponível em Notas.',
      submissionMessage: 'Será possível editar sua submissão até o fim do período de submissão'
    },
    ActivitiesEvaluateComponent: {
      modalButton: 'Corrigir',
      evaluateModal: 'Corrigir Atividade.',
      grade: 'Nota',
      scoreLabel: 'Nota: ',
      comment: 'Comentários e observações.',
      answer: 'Submissão do aluno: ',
      noAnswer: 'A submissão não foi realizada.',
      commentLabel: 'Comentários: ',
      cancel: 'Cancelar',
      submit: 'Enviar'
    },
    ActivitiesFilterComponent: {
      filter: 'Filtrar',
      options: {
        NoFilter: 'Sem filtro',
        Evaluated: 'Avaliado',
        ToEvaluate: 'A ser avaliado',
        ToDo: 'A ser feito',
        Done: 'Concluídos',
        Ended: 'Encerrados'
      }
    },
    ActivitiesSubmissionsListComponent: {
      filter: 'Filtrar',
      filterBy: 'Filtrar por',
      name: 'Nome',
      grade: 'Nota',
      status: 'Estado',
      action: 'Ação',
      evaluated: 'Corrigido',
      submitted: 'Enviado',
      notSubmitted: 'Não enviado',
      options: {
        NoFilter: 'Sem filtro',
        Submitted: 'Enviados',
        NotSubmitted: 'Não enviados',
        Evaluated: 'Avaliados',
        ToEvaluate: 'A ser avaliado'
      }
    },
    ActivitiesListStudentsComponent: {
      filter: 'Filtrar',
      filterBy: 'Filtrar por',
      name: 'Alunos',
      grades: 'Notas',
      submission: 'Submissão',
      submissions: 'Submissões',
      evaluated: 'Corrigido',
      submitted: 'Submetidos',
      submittedNone: 'Não Submetidos',
      submissionsNone: 'Não há submissões',
      submissionsDate: 'Data de submissão',
      notSubmitted: 'Não enviado',
      evaluation: 'Avaliar Submissões',
      evaluateModal: 'Avaliar submissão',
      release: 'Liberar notas',
      releaseWarning: 'Ao liberar as notas você poderá atribuir nota ZERO à todos alunos que não realizaram a submissão.',
      released: 'Notas liberadas em ',
      seeAndEvaluate: 'Ver e avaliar',
      evaluate: 'Avaliar',
      hasComment: 'Contém comentário',
      hasNotComment: 'Não contém comentário',
      score: 'Nota:',
      comment: 'Comentário do Professor:',
      close: 'Fechar',
      notSubmittedExclamation: 'O aluno não enviou a atividade.',
      submissionsOver: 'Não há mais submissões para serem avaliadas.',
      submittedAll: 'Todos os Alunos submeteram a atividade',
      submissionPreMessageA: 'Os alunos listados poderão submeter no período de submissão (',
      submissionPreMessageB: 'até ',
      submissionPreMessageC: ').',
      options: {
        NoFilter: 'Sem filtro',
        Submitted: 'Enviados',
        NotSubmitted: 'Não enviados',
        Evaluated: 'Avaliados',
        ToEvaluate: 'A ser avaliado'
      }
    },
    ActivitiesMenuComponent: {
      create: 'Criar atividade',
      createSm: 'Criar',
      trash: 'Abrir lixeira',
      trashSm: 'Lixeira'
    },
    ActivitiesTrashComponent: {
      title: 'Lixeira de atividades',
      goBack: 'Voltar para Atividades',
      goBackSm: 'Voltar',
      cleanTrash: 'Limpar lixeira',
      restoreAll: 'Restaurar todas as atividades',
      cleanTrashSm: 'Limpar',
      restoreAllSm: 'Restaurar'
    },
    ActivitiesSortComponent: {
      sort: 'Ordenar',
      options: {
        Newer: 'Mais recentes',
        LastModified: 'Modificados recentemente',
        Older: 'Mais antigos'
      }
    },
    ActivitySharedComponent: {
      fullShared: 'Totalmente Compartilhado',
      sharedWithTrainers: 'Compartilhar com Formadores',
      noShared: 'Não Compartilhado'
    }
  },
  calendar: {
    CalendarComponent: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      eventsTitle: 'Eventos no dia',
      ends: 'Termina',
      days: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      months: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ],
      monthsSm: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ]
    }
  },
  course: {
    CourseComponent: {

    },
    LeftMenuComponent: {
      courses: 'Cursos',
      wall: 'Mural',
      materials: 'Materiais',
      activities: 'Atividades',
      grades: 'Notas',
      participants: 'Participantes',
      calendar: 'Calendário',
      performance: 'Desempenho',
      admins: 'Administradores'
    },
    TabComponent: {
      wall: 'Mural',
      tasks: 'Tarefas',
      people: 'Pessoas',
      groups: 'Grupos'
    }
  },
  courseEdit: {

  },
  courseRegister: {
    CourseRegisterComponent: {
      courseRegister: 'Cadastrar curso'
    },
    CourseRegisterFormComponent: {
      title: 'Cadastrar curso',
      name: 'Nome do Curso',
      namePH: 'Nome do Curso',
      info: 'Informações sobre Curso',
      infoPH: 'Informações sobre o curso',
      subsBegin: 'Início da inscrição no curso',
      subsEnd: 'Fim da inscrição no curso',
      courseBegin: 'Início do curso',
      courseEnd: 'Fim do curso',
      numberStudents: 'Número máximo de estudantes',
      teacherEmail: 'E-mail do professor',
      submit: 'Enviar',
      goBack: 'Voltar',
      communicating: 'Comunicando com o servidor...',
      update: 'Atualizar informações do curso',
      updateSucess: "Informações do curso atualizadas com sucesso.",
      updateError: "Não foi possível atualizar as informações do curso.",
      tryAgain: "Tente novamente",
      errorMessages: {
        subscriptionDate : "A data de início da assinatura deve ser anterior à data de término",
        courseDate: "A data de início do curso deve ser anterior à data de término"
      },
      validationMessages: {
        courseName: {
          required: 'Nome do curso necessário.',
        },
        info: {
          required: 'Informação necessária.'
        },
        subscriptionBegin: {
          required: 'Data do início das inscrições necessária.'
        },
        subscriptionEnd: {
          required: 'Data do final das inscrições necessária.'
        },
        startDate: {
          required: 'Data do início do curso necessária.'
        },
        endDate: {
          required: 'Data do final do curso necessária.'
        },
        noMaxStudents: {
          required: 'Há um número máximo de alunos para criar um curso.'
        },
        teacherEmail: {
          required: 'Um cursos deve possuir um professor',
          email: 'E-mail inválido.'
        }
      }
    },
    CourseRegisterResponseComponent: {
      teacherEmail: 'E-mail do professor:',
      error: {
        error: 'Erro:',
        userNotFoundMessage: 'O usuário que você colocou como professor não foi encontrado.',
        tryAgain: 'Tente novamente',
        message: 'Cadastro do cursos falhou.'
      },
      noError: {
        courseName: 'Nome do curso: ',
        teacherName: 'Nome do professor: ',
        message: 'Cadastro realizado com sucesso!',
        goBack: "Voltar.",
        copyToclipBoard: "Copiar informações para área de transferência",
        detaliedInformation: 'Informações detalhadas',
        startRegister : 'Início do cadastro do curso:',
        endRegister: 'Fim do cadastro do curso:',
        startCourse: 'Início do curso:',
        endCourse: 'Fim do curso:',
        maxEstudents: 'Número máximo de alunos:',
        courseId: "ID do curso:",
        copied: "copiado!"
      }
    }
  },
  grades: {
    GradesPersonalComponent: {
      activities: 'Atividades',
      activitiesList: 'Atividades do Curso',
      evaluatedActivities: 'Atividades avaliadas',
      notEvaluatedActivities: 'Atividades não avaliadas',
      notEvaluated: 'Não Avaliado',
      notGraded: 'Não vale nota',
      currentGrade: 'Média Parcial',
      scoreStudent: 'Nota individual',
      score: 'Nota:',
      comment: 'Comentário do Professor:',
      activitiesNull: 'Não há atividade a ser exibida',
      submitted: 'Submetido',
      notSubmitted: 'Não submetido',
      submitting: 'Já Submeteu',
      notSubmitting: 'Não submeteu ainda',

      seeDetails: 'Detalhes da média',

      scoreCourse: 'Média da Turma',
      hasComment: 'Contém comentário',
      hasNotComment: 'Não contém comentário',
      mediaNull: '0',

      gradedActivities: 'Avaliações para Nota',
      practiceActivities: 'Atividades de Treinamento',

      notesNotReleased: 'Notas não lançadas'
    },
    GradesCourseComponent: {
      students: 'Alunos',
      activities: 'Atividades',
      notEvaluated: 'Não Avaliado',
      gradeWeight: 'Peso',
      media: 'Média da Turma',
      scoreStudent: 'Média',
      scoreEdit: 'Editar',
      notSubmitted: 'O aluno não submeteu',
      notGraded: 'Não vale nota',
      submitted: 'Submetido',
      submitting: 'Já submeteu',
      notSubmitting: 'Ainda não submeteu',
      averageTitle: 'Atualizar Cálculo da média',
      studentNull: 'Não há alunos matrículados',
      evaluatedActivities: 'Atividades com notas liberadas',
      notEvaluatedActivities: 'Atividades sem notas liberadas',
      futureActivities: 'Atividades futuras',
      activitiesNull: 'Não há atividades a serem exibidas',
      usersNull: 'Não ha alunos cadastrados no Curso',
      gradesNull: 'Não há notas a serem exibidas',
    },
    GradesEditWeightComponent: {

      activities: 'Atividades',
      gradeWeight: 'Peso',
      defaultWeight: 'Peso padrão para novas atividades',
      totalWeight: 'Soma dos pesos',
      addWeight: 'Atribuir peso',
      sameWeight: 'Atribuir mesmo peso',
      weightWarning1: 'ATENÇÃO! Ao ativar',
      weightWarning2: ' "atribuir mesmo peso"',
      weightWarning3: ', todas as atividades (incluindo as que forem criadas daqui em diante) terão seu peso definido como 1 (um) fazendo com que a média seja uma média aritmética simples. ',
      pubUpdate: 'Publicar atualização no mural',
      activityNonSetWeight: 'Peso das atividades não cadastradas',
      scoreEdit: 'Editar',
      averageTitle: 'Calculo de média ponderada',
      studentNull: 'Não há alunos matrículados',
      activitiesNull: 'Não há atividades a serem exibidas',
      usersNull: 'Não há alunos cadastrados no curso',
      gradesNull: 'Não há notas a serem exibidas',
      btnClose: 'Fechar',
      btnSave: 'Salvar',

      weightedAvarageExplanation: 'A média é feita de forma ponderada, os pesos de cada atividade podem ser vistos abaixo.',
      arithmeticAvarageExplanation: 'A média é aritimética, todas as atividades tem o mesmo peso na média final.'
    }
  },
  home: {
    HomeComponent: {
      myCourses: 'Meus Cursos',
      enterCourse: 'Entrar em um curso',
      filterName: 'Nome',
      filterCreatedDate: 'Data de criação',
      filterEnrolledAsStudent: 'Inscrito como aluno',
      filterEnrolledAsTeacher: 'Inscrito como professor',
      filterAll: 'Todos',
      endedCourses: "Cursos finalizados",
      activeCourses: "Cursos ativos",
      sortName: 'Nome',
      sortCreationDate: 'Data de criação'
    },
    HomeCourseViewComponent: {
      seeMoreInformation: 'Ver informações do curso',
      noActivities: 'Não há eventos nos próximos 15 dias',
      activities: 'eventos nos próximos 15 dias',
      prof: 'Prof',
      addParticipant: "Adicionar Participante"
    },
    HomeCoursesComponent: {
      previousCourses: 'Cursos anteriores'
    },
    HomeUserMenu: {
      calendar: 'Calendário',
      notices: 'Notícias',
      forum: 'Fórum',
      logOut: 'Sair'
    },
    HomeEnterComponent: {
      addKey: 'Adicione a chave de acesso do curso que seu professor compartilhou com você no campo.',
      logIn: 'Conectar em',
      accessKey: 'Chave de acesso',
      invalid: 'inválida',
      cancel: 'Cancelar',
      confirm: 'Confirmar'
    },
    offlineNotification: {
      offlineAlert: 'Você está offline',
      offlineSyncWarning: 'Você está offline. Sincronização necessária!'
    },
    offlineWarning: {
      title: 'Cuidado - Você está offline!',
      base: "Se você sair agora, não poderá acessar a página até que sua conexão seja restaurada. Ao ficar, você pode continuar trabalhando com todos os recursos disponíveis offline até então.",
      ifHasToSync: 'Existem mudanças esperando para serem sincronizadas; eles serão perdidos se você sair.'
    }
  },
  admin: {
    AdminComponent: {

    },
    AdminViewComponent: {
      upcomingTasks: 'Próximas atividades'
    },
    AdminPanelComponent: {
      previousCourses: 'Cursos anteriores'
    },
    AdminListComponent: {
      name: 'Nome',
      edit: 'Editar',
      erase: 'Apagar',
      administrators: 'Administradores'
    },
    AdminListCoursesComponent: {
      courses: 'Cursos',
      deleteError: "Não foi possível apagar o curso. O curso não está vazio.",
      error: "Erro",
      close: "Fechar.",
      updateCourse: "Atualizar informação do curso."
    }
  },
  login: {
    LoginComponent: {
      email: 'E-mail',
      emailPH: 'Digite aqui o seu e-mail.',
      password: 'Senha',
      passwordPH: 'Digite aqui a sua senha.',
      login: 'Entrar',
      notRegistered: 'É novo por aqui?',
      register: 'Cadastre-se',
      forgotPassword: 'Esqueceu a senha?',
      loginError: 'E-mail ou senha inválidos. Tente novamente.',
      validationMessages: {
        email: 'E-mail inválido.',
        password: 'Deve conter no mínimo 8 caracteres.'
      },
      registerOK: 'Cadastro completo! Por favor, faça login abaixo com a sua senha.'
    },
    LoginForgotPasswordComponent: {
      forgotPassword: 'Esqueceu a senha?',
      email: 'E-mail',
      emailPH: 'Digite aqui o seu e-mail cadastrado.',
      errorMessage: 'E-mail inválido. Tente novamente.',
      successMessage: 'E-mail enviado com sucesso!',
      message: 'Enviaremos em seu e-mail o link para você redefinir sua senha. Clique nele e cadastre sua nova senha.',
      cancel: 'Cancelar',
      conclude: 'Concluir'
    },
    LoginChangePasswordComponent: {
      changePassword: 'Trocar senha',
      password: 'Nova senha',
      passwordPH: 'Digite aqui a sua nova senha.',
      repeatPassword: 'Repetir nova senha',
      repeatPasswordPH: 'Repita aqui a sua nova senha.',
      validationMessages: {
        password: 'Deve conter no mínimo 8 caracteres.',
        repeatPassword: 'As senhas são diferentes.',
        repeatPasswordOK: 'As senhas são iguais.'
      },
      conclude: 'Concluir',
      passwordChanged: 'Senha alterada com sucesso! Aguarde e você será redirecionado para a página inicial...'
    }
  },
  material: {
    general: {
      link: 'Link',
      file: 'Arquivo',
      folder: 'Pasta'
    },
    MaterialMenuComponent: {
      createFolder: 'Criar Pasta',
      createLink: 'Criar Link',
      uploadFile: 'Carregar Arquivo'
    },
    MaterialDropdownComponent: {
      link: {
        edit: 'Editar Link',
        move: 'Mover Link',
        delete: 'Deletar Link'
      },
      file: {
        move: 'Mover Arquivo',
        delete: 'Deletar Arquivo'
      },
      folder: {
        edit: 'Editar Pasta',
        delete: 'Deletar Pasta',
        download: 'Download Pasta'
      },
      folderHasItems: "Esta pasta não pôde ser apagada, pois contém material(is)"
    },
    MaterialMoveComponent: {
      folder: 'Arquivo',
      rootName: '(Diretório raiz)',
      cancel: 'Cancelar',
      submit: 'Criar'
    },
    MaterialCreateLinkComponent: {
      link: 'Link',
      linkPH: 'Inserir link',
      title: 'Título',
      titlePH: '(Obrigatório) Insira um título',
      modalTitle: 'Criar Link',
      cancel: 'Cancelar',
      submit: 'Criar',
      validationMessages: {
        title: {
          required: 'Título necessário.',
          minlength: 'Título inválido (muito curto).'
        },
        link: {
          required: 'O link é necessário',
          pattern: 'Link inválido'
        }
      }
    },
    MaterialCreateFolderComponent: {
      title: 'Nome da pasta',
      titlePH: 'Digite aqui o nome da nova pasta',
      description: 'Descrição da pasta',
      descriptionPH: 'Digite aqui a descrição da nova pasta',
      modalTitle: 'Criar pasta',
      folderDownloadButtonTitle: 'Download Pasta',
      cancel: 'Cancelar',
      submit: 'Criar',
      validationMessages: {
        title: {
          required: 'Título necessário.',
          maxlength: 'Título inválido (muito longo).'
        },
        description: {
          maxlength: 'Descrição inválida (too long).'
        },
      }
    }
  },
  people: {
    AddModalComponent: {
      addPerson: 'Adicionar Pessoa',
      add: 'Adicionar'
    },
    PeopleComponent: {

    },
    PeopleFormComponent: {
      name: 'Nome',
      lastName: 'Sobrenome',
      login: 'Login',
      email: 'Email',
      submit: 'Enviar',
      newUser: 'Novo usuário'
    },
    PutModalComponent: {
      changeUser: 'Alterar Usuário'
    },
    SubmittedComponent: {
      addPersonMessage: 'Você adicionou a seguinte pessoa',
      name: 'Nome',
      lastName: 'Sobrenome',
      login: 'Login',
      email: 'Email'
    }
  },
  profile: {
    ProfilePersonalDataEditComponent: {
      aboutMe: 'Breve bibliografia',
      aboutMeErrorMaxNumChars: 'Deve conter, no máximo, 1.000 caracteres.',
      aboutMeHelp1: 'Utilizar até 1.000 caracteres.',
      aboutMeHelp2: 'Já foram utilizados: ',
      fullName: 'Nome completo',
      nameRequired: 'Não pode estar vazio.',
      nameErrorMaxNumChars: 'Deve conter no máximo 100 caracteres.',
      nameHelp: 'Utilizar até 100 caracteres.',
    },
    ProfilePasswordEditComponent: {
      email: 'E-mail',
      infoAccount: 'Informações da conta',
      editPassword: 'Trocar senha',
      oldPassword: 'Senha atual',
      newPassword: 'Nova senha',
      repeatPassword: 'Repetir nova senha',
      equalPasswd: 'As senhas são iguais.',
      differentPasswd: 'As senhas são diferentes.',
      mustContain: 'Deve conter no mínimo ',
      char: ' caracteres.',
      oldPasswordDoNotMatch: 'Senha incorreta.'
    },
    ProfileCoursesComponent: {
      enrolledAsATeacher: 'Inscrito como professor',
      enrolledAsAStudent: 'Inscrito como aluno',
    },
    ProfilePersonalDataComponent: {
      editPassword: 'Editar senha',
      edit: 'Editar'
    },
    actions: {
      edit: 'Editar perfil',
      update: 'Atualizar',
      confirm: 'Confirmar',
      save: 'Salvar',
      cancel: 'Cancelar',
      editPassword: 'Trocar senha'
    }
  },
  register: {
    RegisterComponent: {
      register: 'Fazer cadastro',
      name: 'Nome',
      namePH: 'Digite aqui o seu nome.',
      email: 'E-mail',
      emailPH: 'Digite aqui o seu email.',
      password: 'Senha',
      passwordPH: 'Digite aqui a sua senha.',
      repeat_password: 'Repetir senha',
      repeat_passwordPH: 'Repita aqui a sua senha.',
      message: 'Enviaremos em seu e-mail o link para você confirmar o seu cadastro. Clique nele e acesse nossa plataforma!',
      conclude: 'Concluir',
      alreadyRegistered: 'Já possui cadastro?',
      accessAccount: 'Acessar conta',
      validationMessages: {
        name: 'Não pode estar vazio.',
        email: 'E-mail inválido.',
        password: 'Deve conter 8 caracteres.',
        repeat_password: 'As senhas são diferentes.',
        repeat_passwordOK: 'As senhas são iguais.'
      },
      registerOK: 'Cadastro inicial realizado com sucesso! Verifique seu e-mail e clique no link indicado para confirmá-lo.'
    }
  },
  repository: {
    RepositoryComponent: {

    }
  },
  shared: {
    CreateFolderComponent: {
      create: 'Criar pasta',
      createSm: 'Criar',
      folderName: 'Nome da pasta',
      folderNamePH: 'Digite aqui o nome da nova pasta',
      modalTitle: 'Criar pasta',
      cancel: 'Cancelar',
      submit: 'Criar',
      adding: 'Adicionando pasta...',
      error: 'Não foi possível adicionar a pasta',
      validationMessages: {
        name: {
          required: 'Nome necessário.',
          minlength: 'Nome precisa ter no mínimo 4 caracteres.',
          maxlength: 'Nome não pode ter mais de 24 caracteres.',
        },
        path: {
          required: 'Caminho necessário.'
        }
      }
    },
    DateSelectComponent: {
      at: 'às'
    },
    ModalFormComponent: {
      title: 'Preencha o formulário'
    },
    ConfirmDeleteComponent: {
      title: 'Confirmar exclusão',
      confirmAction: "Confirmar esta ação",
      questionDelete: `Você deseja realmente apagar esta atividade? Esta ação é irreversível e as informações não podem ser restauradas.`,
      questionCancel: `Você deseja realmente cancelar esta atividade? Esta ação é irreversível e as informações não podem ser restauradas.
                      Após a confirmação, os alunos serão notificados do cancelamento no mural`,
      questionGradesReleased: `Deseja realmente lançar as notas desta atividade? Esta ação é irreversível.
                      Após a confirmação, os alunos serão avisados do lançamento no mural.`,
      confirm: "Confirmar.",
      cancel: "cancelar."
    },
    FileItemComponent: {
      download: 'Baixar'
    },
    FileListComponent: {
      files: 'Arquivos',
      undo: 'Desfazer',
      removeAll: 'Remover todos',
      noFile: 'Não existem arquivos anexos.',
      noFileSelected: 'Nenhum arquivo foi selecionado.'
    },
    FileUploadComponent: {
      addFile: 'Anexar',
      dropFiles: 'Arraste e solte arquivos aqui',
      files: 'Arquivos',
      undo: 'Desfazer',
      removeAll: 'Remover todos',
      noFile: 'Não existem arquivos anexos.',
      noFileSelected: 'Nenhum arquivo foi selecionado.'
    },
    PublicationDateComponent: {
      title: 'Data de Publicação',
      publishNow: 'Publicar agora',
      chooseDate: 'Agendar publicação',
      saveDraft: 'Salvar rascunho'
    },
    SubmissionDateComponent: {
      title: 'Período de submissão',
      start: 'Início',
      end: 'Término'
    },
    translateButton: {
      english: 'Inglês (EN)',
      portuguese: 'Português (PT-BR)'
    },
    time: {
      at: 'às'
    }
  },
  wall: {
    WallCreateComponent: {
      typeYourPost: 'Digite sua postagem aqui...',
      textHelp1: 'Utilizar até 1.000 caracteres.',
      textHelp2: 'Já foram utilizados: ',
      publish: 'Publicar'
    },
    WallPostComponent: {
      newActivity: 'Uma nova atividade foi publicada.',
      canceledActivity: 'Uma atividade foi cancelada.',
      gradesReleased: 'As notas de uma atividade foram lançadas.',
      averageUpdate: 'Cálculo da média atualizado',
      averageUpdateExplain: 'O método de cálculo ou os pesos das atividades foram atualizados. Entre na página de notas para ver detalhes.',
      pin: 'Fixar',
      unpin: 'Desafixar',
      edit: 'Editar',
      delete: 'Apagar',
      readMore: 'LER MAIS...',
      activityPost: {
        title1: 'A atividade',
        title2: 'foi publicada',
        title3: 'foi cancelada',
        title4: 'As notas da atividade',
        title5: 'foram lançadas',
        dates: 'Será possível fazer sua submissão no período entre',
        atHours: 'às',
        untilDate: 'até',
        graded: 'Esta atividade vale nota'
      }
    },
    WallItemComponent: {
      oldComments: 'Ver comentários mais antigos'
    },
    WallCommentComponent: {
      edit: 'Editar',
      delete: 'Apagar',
      readMore: 'LER MAIS...',
      addReply: 'Adicionar resposta',
    },
    WallCommentCreateComponent: {
      typeYourComment: 'Digite seu comentário aqui...',
      error: 'Utilizar até 1.000 caracteres.',
      comment: 'Comentar'
    },
    WallCommentReplyCreateComponent: {
      typeYourReply: 'Digite sua resposta ao comentário aqui...',
      error: 'Use até 1.000 caracteres.',
      addReply: 'Adicionar comentário',
      submit: 'Criar'
    },
    WallCommentReplyComponent: {
      typeYourComment: 'Digite seu comentário aqui...',
      error: 'Use até 1.000 caracteres.',
      addReply: 'Adicionar comentário',
      submit: 'Criar',
      readMore: 'LER MAIS...',
      edit: 'Editar',
      delete: 'Apagar'
    }
  },
  members: {
    MembersComponent: {
      addParticipant: 'Adicionar Participante',
      all: 'Todos',
      teachers: 'Professores',
      students: 'Alunos',
      admins: 'Administradores',
      name: 'Nome'
    },
    MembersAddComponent: {
      shareKey: 'Compartilhe esta chave com seus alunos para que eles possam entrar no seu curso.',
      generateKey: 'Gerar nova chave',
      warning: 'Aviso! Ao substituir a chave de acesso ao curso, a chave anterior será desativada permanentemente!',
      close: 'Fechar'
    },
    MembersItemComponent: {
      lastAccess: 'Último acesso:',
      teacher: 'Professor',
      student: 'Aluno',
      admin: 'Administrador'
    }
  }
};
