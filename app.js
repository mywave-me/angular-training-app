angular
  .module("mywaveDemoApp", [])
  .factory("Status", function() {
    const statusList = [];
    return {
      remove: alert => {
        const index = statusList.find(_alert => _alert === alert);
        statusList.splice(index, 1);
      },
      add: (type = "error", message) => {
        statusList.push({ type, message });
      },
      statusList: statusList
    };
  })
  .factory("Conversations", function(Status, $rootScope) {
    return {
      summaries: [],
      current: null,
      validationMessage: "",

      startConversation: function(intent) {
        const _this = this;
        const account = mwSdk.getCurrentStoredAccount();
        if (intent) {
          account
            .startConversation(intent)
            .then(conversation => {
              _this.current = conversation;
              _this.validationMessage = '';
              $rootScope.$apply();
            })
            .catch(error => {
              Status.add("danger", error.message);
              $rootScope.$apply();
            });
        } else {
          Status.add(
            "danger",
            "Please enter an intent (e.g. I want to buy a jacket)"
          );
        }
      },
      getConversations: function() {
        const _this = this;
        const account = mwSdk.getCurrentStoredAccount();
        return account
          .getConversations()
          .then(conversations => {
            _this.summaries = conversations.getConversationSummaries();
            $rootScope.$apply();
          })
          .catch(error => {
            Status.add("danger", error.message);
            $rootScope.$apply();
          });
      },
      getConversation: function(conversationId) {
        const _this = this;
        const account = mwSdk.getCurrentStoredAccount();

        return account
          .getConversation(conversationId)
          .then(conversation => {
            _this.current = conversation;
            _this.validationMessage = '';

            $rootScope.$apply();
          })
          .catch(error => {
            Status.add("danger", error.message);
            $rootScope.$apply();
          });
      }
    };
  })
  .controller("MainController", function($scope, Status) {
    const main = this;

    main.createAccount = function() {
      mwSdk
        .createAccount()
        .then(newAccount => {
          main.account = newAccount;
          $scope.$apply();
        })
        .catch(error => {
          Status.add("danger", error.message);
          $scope.$apply();
        });
    };
  })
  .controller("StatusController", function(Status) {
    this.statusList = Status.statusList;
    this.remove = Status.remove;
  })
  .controller("NewConversationController", function($scope, Conversations) {
    const newConversation = this;

    newConversation.sampleQuestions = [];

    newConversation.start = function(intent) {
      Conversations.startConversation(intent);
    };

    newConversation.getSampleQuestions = function() {
      mwSdk.getServerConfig().then(config => {
        for (const question of config.getSampleQuestions()) {
          newConversation.sampleQuestions.push(question);
        }
        $scope.$apply();
      });
    };
  })
  .controller("ConversationsController", function($scope, Conversations) {
    const handleValidationResult = function(validationResult) {
      if (!validationResult.isValid()) {
        conversations.data.validationMessage = validationResult.getErrorMessage();
      } else {
        conversations.data.validationMessage = "";
      }
    };

    const conversations = this;
    conversations.data = Conversations;

    conversations.getConversations = function() {
      Conversations.getConversations();
    };

    conversations.getConversation = function(conversationId) {
      Conversations.getConversation(conversationId)
    };

    conversations.enterText = function(field, textInput) {
      const validationResult = field.enter(textInput);
      handleValidationResult(validationResult);
    };

    conversations.chooseAnswer = function(field, label) {
      const validationResult = field.choose(label);

      handleValidationResult(validationResult);
    };

    conversations.chooseRichContent = function(field, index) {
      const validationResult = field.choose(index);

      handleValidationResult(validationResult);
    };

    conversations.selectAnswer = function(field, label) {
      const answers = field.getAnswer();
      let validationResult;
      if (answers.includes(label)) {
        validationResult = field.deselect(label);
      } else {
        validationResult = field.select(label);
      }

      handleValidationResult(validationResult);
    };

    conversations.enterOther = function(field, textInput) {
      const validationResult = field.enterOther(textInput);

      handleValidationResult(validationResult);
    };

    conversations.enterCurrency = function(field, textInput) {

      const validationResult = field.enter(parseFloat(textInput));
      handleValidationResult(validationResult);
    };

    conversations.enterNumber = function(field, textInput) {

      const validationResult = field.enter(parseFloat(textInput));
      handleValidationResult(validationResult);
    };

    conversations.toggleConfirm = function(field) {
      field.confirm(!field.getAnswer());
    };

    conversations.confirmAll = function(interaction) {
      const fields = interaction.getFields();
      for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
          fields[key].confirm(true);
        }
      }
    };

    conversations.isAllGood = function() {
      const interaction = conversations.data.current.getCurrentInteraction();
      const answers = Object.values(interaction.getAnswers());
      return (
        answers
          .map(answer => (answer ? true : false))
          .filter(answer => answer === false).length === 0
      );
    };

    conversations.getRichContentChoices = function(field) {
      field.getRichContentChoices().then(result => {
        conversations.richContent = result
        $scope.$apply();
      });
    }

    conversations.submitAnswers = function() {
      conversations.data.current.submitAnswers().then(result => {
        if (result.isSubmitted()) {
          $scope.$apply(() => {
            conversations.data.current = result.getAnsweredConversation();
          });
        } else {
          $scope.$apply(() => {
            conversations.data.validationMessage = Object.values(
              result.getFieldValidationErrors()
            ).join(",");
          });
        }
      });
    };
  });
