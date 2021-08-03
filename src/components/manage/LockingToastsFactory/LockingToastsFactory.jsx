import React from 'react';
// import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Toast } from '@plone/volto/components';
// import { flattenToAppURL } from '@plone/volto/helpers';
import { parse } from 'date-fns';
import config from '@plone/volto/registry';
import useDeepCompareEffect from 'use-deep-compare-effect';

const messages = defineMessages({
  thisItemIsLocked: {
    id: 'This item was locked by {creator} on {date}',
    defaultMessage: 'This item was locked by {creator} on {date}',
  },
  unlockItem: {
    id:
      'If you are certain this user has abandoned the object, you may unlock the object. You will then be able to edit it.',
    defaultMessage:
      'If you are certain this user has abandoned the object, you may unlock the object. You will then be able to edit it.',
  },
});

const LockingToastsFactory = (props) => {
  const intl = useIntl();
  const pathname = useLocation().pathname;
  const lang = useSelector((state) => state.intl.locale);
  const { content, user } = props;
  const locking = content?.['@components']?.['lock'];
  const creator = locking?.creator_name || locking?.creator || '';
  // const creator_url = locking?.creator_url || '';
  const date = locking?.created || '';
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  useDeepCompareEffect(() => {
    if (config.settings.hasLockingSupport && user && content) {
      if (locking?.locked && locking?.creator !== user) {
        if (toast.isActive('lockinginfo')) {
          toast.update('lockinginfo', {
            render: (
              <Toast
                info
                title={intl.formatMessage(messages.thisItemIsLocked, {
                  creator: creator,
                  date: new Intl.DateTimeFormat(lang, dateOptions).format(
                    parse(date),
                  ),
                })}
                content={intl.formatMessage(messages.unlockItem, {})}
              />
            ),
          });
        } else {
          toast.info(
            <Toast
              info
              title={intl.formatMessage(messages.thisItemIsLocked, {
                creator: creator,
                date: new Intl.DateTimeFormat(lang, dateOptions).format(
                  parse(date),
                ),
              })}
              content={intl.formatMessage(messages.unlockItem, {})}
            />,
            {
              toastId: 'lockinginfo',
              autoClose: false,
              closeButton: false,
              transition: null,
            },
          );
        }
      } else {
        if (toast.isActive('lockinginfo')) {
          toast.dismiss('lockinginfo');
        }
      }
    }
  }, [
    content,
    creator,
    date,
    dateOptions,
    intl,
    lang,
    locking,
    pathname,
    user,
  ]);

  return null;
};

export default LockingToastsFactory;