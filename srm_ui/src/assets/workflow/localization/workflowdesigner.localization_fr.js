var AngularBPWorkflowDesignerConstants = {
  ActivityColor: "#ECF0F1",
  ActivityTextColor: "#2D3436",
  ActivityInitialColor: "#27AE60",
  ActivityInitialTextColor: "#FFFFFF",
  ActivityFinalColor: "#2980B9",
  ActivityFinalTextColor: "#FFFFFF",
  ActivityShape: "#CECECE",
  SelectColor: "#F39C12",
  SelectTextColor: "#FFFFFF",
  SelectSubProcessColor: "#e3b015",
  SelectSubProcessTextColor: "#FFFFFF",
  ButtonActive: "#D4D8D9",
  BarColor: "#EDF1F2",
  BarSeparatorColor: "#D9DEE0",
  DeleteConfirm: "Êtes-vous sûr de vouloir supprimer le ou les éléments sélectionnés?",
  DeleteConfirmCurrent: "Êtes-vous sûr de bien vouloir supprimer cet élément?",
  FieldIsRequired: "Champ requis!",
  FieldMustBeUnique: "Le champ doit être unique!",
  ButtonTextDelete: "Effacer",
  ButtonTextCreate: "Créer",
  ButtonTextSave: "Sauver",
  ButtonTextYes: "Oui",
  ButtonTextNo: "Non",
  ButtonTextCancel: "Annuler",
  ButtonTextClose: "Fermer",
  ButtonTextUndo: "annuler",
  ButtonTextRedo: "Refaire",
  SaveConfirm: "Sauver les modifications?",
  CloseWithoutSaving: "Fermer sans enregistrer?",
  DialogConfirmText: "Question",
  None: "Aucun",
  Warning: "Attention",
  InfoBlockLabel: {
    Activity: "Activités:",
    Transition: "Transitions:",
    Command: "Commandes:"
  },
  ActivityNamePrefix: "Activité_",
  ActivityFormLabel: {
    Title: "Activité",
    Name: "Prénom",
    State: "Etat",
    IsInitial: "Initiale",
    IsFinal: "Final",
    IsForSetState: "Pour l'état défini",
    IsAutoSchemeUpdate: "Mise à jour automatique",
    Implementation: "La mise en oeuvre",
    PreExecutionImplementation: "La mise en oeuvre PreExecution",
    ImpOrder: "Ordre",
    ImpAction: "Action",
    ImpActionParameter: "Paramètre d'action",
    AlwaysConditionShouldBeSingle: "Toujours condition devrait être célibataire",
    OtherwiseConditionShouldBeSingle: "Sinon, la condition devrait être unique"
  },
  TransitionFormLabel: {
    Title: "Transition",
    Name: "Prénom",
    From: "De l'activité",
    To: "À l'activité",
    Classifier: "Classificateur",
    Restrictions: "Restrictions",
    RestrictionsType: "Type",
    RestrictionsActor: "Acteur",
    Condition: "État",
    ConditionType: "Type",
    ConditionAction: "action",
    ResultOnPreExecution: "Résultat sur la pré-exécution",
    Trigger: "Déclencheur",
    TriggerType: "Type",
    TriggerCommand: "Commander",
    TriggerTimer: "Minuteur",
    ConditionActionParameter: "Paramètre d'action",
    ConditionInversion: "Inverser le résultat de l'action",
    ConditionsConcatenationType: "Type de concaténation des conditions",
    AllowConcatenationType: "Concat permettent comme",
    RestrictConcatenationType: "Concat restreindre comme",
    ConditionsListShouldNotBeEmpty: "La liste des conditions ne doit pas être vide",
    IsFork: "Est la fourche",
    MergeViaSetState: "Fusionner le sous-processus via l'état défini",
    DisableParentStateControl: "Désactiver le contrôle de processus parent",
    ShowConcatParameters: "Afficher la concaténation",
    HideConcatParameters: "Masquer la concaténation"
  },
  LocalizationFormLabel: {
    Title: "Localisation",
    ObjectName: "ObjectName",
    Type: "Type",
    IsDefault: "IsDefault",
    Culture: "Culture",
    Value: "Valeur",
    Types: [
      "Command",
      "State",
      "Parameter"
    ]
  },
  TimerFormLabel: {
    Title: "Minuteries",
    Name: "Prénom",
    Type: "Type",
    Value: "Valeur",
    Types: [
      "Command",
      "State",
      "Parameter"
    ],
    NotOverrideIfExists: "Ne pas écraser le timer s'il existe"
  },
  ParameterFormLabel: {
    Title: "Paramètres",
    Name: "Prénom",
    Type: "Type",
    Purpose: "Objectif",
    Value: "Valeur",
    InitialValue: "Valeur initiale",
    ShowSystemParameters: "Afficher les paramètres du système"
  },
  ActorFormLabel: {
    Title: "Acteurs",
    Name: "Prénom",
    Rule: "Règle",
    Value: "Valeur"
  },
  CommandFormLabel: {
    Title: "Commander",
    Name: "Prénom",
    InputParameters: "Paramètres d'entrée",
    InputParametersName: "Prénom",
    InputParametersIsRequired: "Champs obligatoires",
    InputParametersParameter: "Paramètre",
    InputParametersDefaultValue: "Défaut"
  },
  AdditionalParamsFormLabel: {
    Title: "Paramètres additionnels",
    IsObsolete: "IsObsolete",
    DefiningParameters: "Définir les paramètres",
    ProcessParameters: "Paramètres de processus",
    ProcessParametersName: "Prénom",
    ProcessParametersValue: "Valeur"
  },
  CodeActionsFormLabel: {
    Title: "Actions de code",
    Name: "Prénom",
    ActionCode: "Code d'action",
    IsGlobal: "Est globale",
    IsAsync: "Async",
    Type: "Type",
    GlobalDeleteMessage: "Vous avez supprimé la Global CodeAction. <br/> <b> Les autres systèmes ne pourront pas appeler cette CodeAction! </ B>",
    UnGlobalMessage: "Vous avez modifié l'état de l'indicateur global. <br/> Une action Code Local sera créée à partir de cette Action Code Global après avoir enregistré ce schéma."
  },
  ToolbarLabel: {
    CreateActivity: "Créer une activité",
    CopySelected: "Copier sélectionné",
    Undo: "annuler",
    Redo: "Refaire",
    Move: "Bouge toi",
    ZoomIn: "Agrandir",
    ZoomOut: "Dézoomer",
    ZoomPositionDefault: "Zoom par défaut",
    FullScreen: "Plein écran",
    Refresh: "Rafraîchir",
    AutoArrangement: "Arrangement automatique",
    Actors: "Acteurs",
    Commands: "Les commandes",
    Parameters: "Paramètres",
    Localization: "Localisation",
    Timers: "Minuteries",
    AdditionalParameters: "Paramètres additionnels",
    CodeActions: "Actions de code",
    Info: "Informations étendues",
    Delete: "Effacer",
    Clone: "Cloner",
    Settings: "Réglages",
    CreateTransition: "Créer une transition",
    CreateActivityTransition: "Créer une activité et une transition",
    Legend: "Légende"
  },
  ErrorActivityIsInitialCountText: "Un élément doit être marqué flag Initial",
  ErrorReadOnlySaveText: "Le concepteur en mode lecture seule, vous ne pouvez pas l'enregistrer.",
  FormMaxHeight: 700,
  EditCodeSettings: {
    Height: 600,
    Width: 1000,
    CodeHeight: 390,
    MessageBoxHeight: 400,
    MessageBoxWidth: 600,
    SuccessBoxHeight: 150,
    SuccessBoxWidth: 300
  },
  EditCodeLabel: {
    Title: "Éditer le code",
    EditCodeButton: "Éditer le code",
    Usings: "Usings",
    Compile: "Compiler",
    CompileSucceeded: "La compilation a réussi.",
    Success: "Succès",
    Error: "Erreur",
    OK: "D'accord",
    ShowUsings: "Afficher les usings",
    HideUsings: "Masquer les usings"
  },
  EditJSONSettings: {
    Height: 600,
    Width: 1000,
    CodeHeight: 480
  },
  EditJSONLabel: {
    Title: "Modifier la valeur en JSON",
    CreateEmptyType: "Créer",
    Format: "Format"
  },
  isjava: false,
  OverviewMap: {
    show: true,
    width: 300,
    height: 150
  },
  UndoDepth: 200,
  DefaultCulture: "fr-FR"
};

