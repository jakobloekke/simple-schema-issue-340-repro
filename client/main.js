import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './main.html';

Template.buttons.events({
    'click button#insert'() {
        Meteor.call('insert');
    },
    'click button#update'() {
        Meteor.call('update');
    }
});
