'use strict';
// var lib = require('./components/components');
(function (scope) {
  var polymer = scope.Polymer('quizzer-login', {
    publish: {
      user: null,
      categories: null,
      url: ''
    },

    observe: {
      'fbUser userReady': 'syncUser'
    },
    ready: function () {
      this.test = window.location.search.indexOf('test') >= 0;
      this.offline = this.test || window.location.search.indexOf('offline') >= 0;
      if (this.test) {
        this.user = {
          name: "Test U",
          avatar: 1,
          score: 0
        };
      } else {
        try {
          this.user = JSON.parse(localStorage.getItem('topeka-user'))
        } catch (e) {
          this.user = null;
        }
      }

      window.addEventListener('offline', function () {
        Firebase.goOffline();
      });
      window.addEventListener('online', function () {
        Firebase.goOnline();
      });
    },

    statusKnownChanged: function () {
      if (this.statusKnown && !this.offline && !this.fbUser) {
        this.$.fbLogin.login();
      }
    },

    syncUser: function () {
      if (this.fbUser && this.userReady) {
        this.$.fbUser.data = this.user;
      } else {
        this.$.fbUser.data = null;
      }
    },

    userChanged: function () {
      if (!this.user) {
        this.logout();
      }
      this.syncUser();
      this.observeUser();
      this.userFieldsChanged();
    },

    observeUser: function () {
      if (this.userObserver) {
        this.userObserver.close();
        this.userObserver = null;
      }
      if (this.user) {
        this.userObserver = new ObjectObserver(this.user);
        this.userObserver.open(this.userFieldsChanged.bind(this));
      }
    },

    userFieldsChanged: function (added, removed, changed, getOldValueFn) {
      localStorage.setItem('topeka-user', JSON.stringify(this.user));
    },

    logout: function () {
      this.$.fbLogin.logout();
      this.$.fbLogin.login();
    }
  });

  return polymer;
})(window);
