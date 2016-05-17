import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {getSlug} from 'meteor/ongoworks:speakingurl';
import _ from 'lodash';

function _generateNewInviteCode() {
    return _.random(0, Math.pow(100, 25)).toString(36); // yeah, randomness!
}

function _report () {
    console.log('Field: ', this.field('Name').value);
    console.log('SiblingField: ', this.siblingField('Name').value);
}

const InviteSchema = new SimpleSchema({
    Code: {type: String}
});

const AccountSchema = new SimpleSchema({
    Name: {type: String},
    AccountUrl: {
        type: String,
        autoValue: function autoValue() {
            if (this.isInsert) {

                console.log('Insert:');
                _report.call(this);
                console.log('---');

                return getSlug(this.field('Name').value);

            } else if (this.isUpdate) {

                console.log('Update:');
                _report.call(this);
                console.log('---');

                return getSlug(this.field('Name').value);

            } else {

                console.log('Other:');
                _report.call(this);
                console.log('---');

                return undefined;
            }
        }
    },
    Invites: {
        type: [InviteSchema],
        defaultValue: []
    }
});

const AccountCollection = new Mongo.Collection('accounts');

AccountCollection.attachSchema(AccountSchema);

Meteor.methods({

    // This creates an account by insert
    'insert': function () {
        const new_account = {
            Name: 'Test'
        };
        AccountCollection.insert(new_account);
    },

    // This touches an account by update
    'update': function () {
        AccountCollection.update(
            {
                AccountUrl: 'test'
            },
            {
                $push: {
                    Invites: {Code: _generateNewInviteCode()}
                }
            }
        );
    }

});