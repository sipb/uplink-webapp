// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import MattermostLogo from 'components/widgets/icons/mattermost_logo';

import {AboutLinks} from 'utils/constants';

export default class AboutBuildModal extends React.PureComponent {
    static defaultProps = {
        show: false,
    };

    static propTypes = {

        /**
         * Function that is called when the modal is dismissed
         */
        onHide: PropTypes.func.isRequired,

        /**
         * Global config object
         */
        config: PropTypes.object.isRequired,

        /**
         * Global license object
         */
        license: PropTypes.object.isRequired,

        /**
         * Webapp build hash override. By default, webpack sets this (so it must be overridden in tests).
         */
        webappBuildHash: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            show: true,
        };
    }

    doHide = () => {
        this.setState({show: false});
    }

    handleExit = () => {
        this.props.onHide();
    }

    render() {
        const config = this.props.config;
        const license = this.props.license;

        let title = 'Fork';

        let subTitle = 'All your team communication in one place, instantly searchable and accessible anywhere.';

        const termsOfService = (
            <a
                target='_blank'
                id='tosLink'
                rel='noopener noreferrer'
                href={AboutLinks.TERMS_OF_SERVICE}
            >
                <FormattedMessage
                    id='about.tos'
                    defaultMessage='Terms of Service'
                />
            </a>
        );

        const privacyPolicy = (
            <a
                target='_blank'
                id='privacyLink'
                rel='noopener noreferrer'
                href={AboutLinks.PRIVACY_POLICY}
            >
                <FormattedMessage
                    id='about.privacy'
                    defaultMessage='Privacy Policy'
                />
            </a>
        );

        let tosPrivacyHyphen;
        if (config.TermsOfServiceLink && config.PrivacyPolicyLink) {
            tosPrivacyHyphen = (
                <span>
                    {' - '}
                </span>
            );
        }

        let mmversion = config.BuildNumber;
        if (!isNaN(config.BuildNumber)) {
            mmversion = 'ci';
        }

        return (
            <Modal
                dialogClassName='a11y__modal about-modal'
                show={this.state.show}
                onHide={this.doHide}
                onExited={this.handleExit}
                role='dialog'
                aria-labelledby='aboutModalLabel'
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title
                        componentClass='h1'
                        id='aboutModalLabel'
                    >
                        <FormattedMessage
                            id='about.title'
                            values={{appTitle: config.SiteName || 'Mattermost'}}
                            defaultMessage='About {appTitle}'
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='about-modal__content'>
                        <div className='about-modal__logo'>
                            <MattermostLogo/>
                        </div>
                        <div>
                            <h3 className='about-modal__title'>{'Uplink'} {title}</h3>
                            <p className='about-modal__subtitle padding-bottom'>{subTitle}</p>
                            <div className='form-group less'>
                                <div>
                                    <FormattedMessage
                                        id='about.version'
                                        defaultMessage='Uplink Version:'
                                    />
                                    <span id='versionString'>{'\u00a0' + mmversion}</span>
                                </div>
                                <div>
                                    <FormattedMessage
                                        id='about.dbversion'
                                        defaultMessage='Database Schema Version:'
                                    />
                                    <span id='dbversionString'>{'\u00a0' + config.Version}</span>
                                </div>
                                <div>
                                    <FormattedMessage
                                        id='about.database'
                                        defaultMessage='Database:'
                                    />
                                    {'\u00a0' + config.SQLDriverName}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='about-modal__footer'>
                        <div className='form-group'>
                            <div className='about-modal__copyright'>
                                <p>{'Original software is Copyright 2015 - ' + new Date().getFullYear() + ' Mattermost, Inc. All rights reserved.'}</p>
                                <p>{'Uplink modifications are Copyright 2020 - ' + new Date().getFullYear() + ' Cel Skeggs and other Uplink contributors.'}</p>
                                <p>{'Uplink is licensed under the AGPL v3, and the source code can be retrieved from '}<a href="https://github.com/sipb/uplink-webapp">{'our GitHub repository'}</a>{'.'}</p>
                            </div>
                            <div className='about-modal__links'>
                                {termsOfService}
                                {tosPrivacyHyphen}
                                {privacyPolicy}
                            </div>
                        </div>
                    </div>
                    <div className='about-modal__notice form-group padding-top x2'>
                        <p>
                            {'Uplink is made possible by the open source software used in our '}<a href="https://github.com/sipb/uplink-server/blob/master/NOTICE.txt">{'server'}</a>{' and '}<a href="https://github.com/sipb/uplink-webapp/blob/master/NOTICE.txt">{'webapp'}</a>{'.'}
                        </p>
                    </div>
                    <div className='about-modal__hash'>
                        <p>
                            <FormattedMessage
                                id='about.hash'
                                defaultMessage='Build Hash:'
                            />
                            &nbsp;{config.BuildHash}
                            <br/>
                            <FormattedMessage
                                id='about.hashee'
                                defaultMessage='EE Build Hash:'
                            />
                            &nbsp;{config.BuildHashEnterprise}
                            <br/>
                            <FormattedMessage
                                id='about.hashwebapp'
                                defaultMessage='Webapp Build Hash:'
                            />
                            &nbsp;{/* global COMMIT_HASH */ this.props.webappBuildHash || (typeof COMMIT_HASH === 'undefined' ? '' : COMMIT_HASH)}
                        </p>
                        <p>
                            <FormattedMessage
                                id='about.date'
                                defaultMessage='Build Date:'
                            />
                            &nbsp;{config.BuildDate}
                        </p>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
