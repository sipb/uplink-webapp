// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedDate, FormattedTime, FormattedMessage} from 'react-intl';

import * as Utils from 'utils/utils.jsx';

import * as AdminActions from 'actions/admin_actions.jsx';

import FormattedMarkdownMessage from 'components/formatted_markdown_message.jsx';
import FormattedAdminHeader from 'components/widgets/admin_console/formatted_admin_header';
import LoadingWrapper from 'components/widgets/loading/loading_wrapper';

export default class LicenseSettings extends React.PureComponent {
    static propTypes = {
        license: PropTypes.object.isRequired,
        stats: PropTypes.object,
        actions: PropTypes.shape({
            getLicenseConfig: PropTypes.func.isRequired,
            uploadLicense: PropTypes.func.isRequired,
            removeLicense: PropTypes.func.isRequired,
            requestTrialLicense: PropTypes.func.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            fileSelected: false,
            fileName: null,
            serverError: null,
            gettingTrialError: null,
            gettingTrial: false,
            removing: false,
            uploading: false,
        };
    }

    componentDidMount() {
        this.props.actions.getLicenseConfig();
        AdminActions.getStandardAnalytics();
    }

    handleChange = () => {
        const element = this.refs.fileInput;
        if (element && element.files.length > 0) {
            this.setState({fileSelected: true, fileName: element.files[0].name});
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const element = this.refs.fileInput;
        if (!element || element.files.length === 0) {
            return;
        }
        const file = element.files[0];

        this.setState({uploading: true});

        const {error} = await this.props.actions.uploadLicense(file);
        if (error) {
            Utils.clearFileInput(element[0]);
            this.setState({fileSelected: false, fileName: null, serverError: error.message, uploading: false});
            return;
        }

        await this.props.actions.getLicenseConfig();
        this.setState({fileSelected: false, fileName: null, serverError: null, uploading: false});
    }

    handleRemove = async (e) => {
        e.preventDefault();

        this.setState({removing: true});

        const {error} = await this.props.actions.removeLicense();
        if (error) {
            this.setState({fileSelected: false, fileName: null, serverError: error.message, removing: false});
            return;
        }

        await this.props.actions.getLicenseConfig();
        this.setState({fileSelected: false, fileName: null, serverError: null, removing: false});
    }

    render() {
        let serverError = '';
        if (this.state.serverError) {
            serverError = <div className='col-sm-12'><div className='form-group has-error'><label className='control-label'>{this.state.serverError}</label></div></div>;
        }
        let gettingTrialError = '';
        if (this.state.gettingTrialError) {
            gettingTrialError = <p className='form-group has-error'><label className='control-label'>{this.state.gettingTrialError}</label></p>;
        }

        var btnClass = 'btn';
        if (this.state.fileSelected) {
            btnClass = 'btn btn-primary';
        }

        const {license} = this.props;
        const {uploading} = this.state;

        let edition;
        let licenseType;
        let licenseKey;

        const issued = (
            <React.Fragment>
                <FormattedDate value={new Date(parseInt(license.IssuedAt, 10))}/>
                {' '}
                <FormattedTime value={new Date(parseInt(license.IssuedAt, 10))}/>
            </React.Fragment>
        );
        const startsAt = <FormattedDate value={new Date(parseInt(license.StartsAt, 10))}/>;
        const expiresAt = <FormattedDate value={new Date(parseInt(license.ExpiresAt, 10))}/>;

        if (license.IsLicensed === 'true' && !uploading) {
            edition = 'SIPB Uplink, a fork of Mattermost. Features considered to be Enterprise features by Mattermost are automatically unlocked in this fork.';
            licenseType = (
                <div>
                    <p>
                        {'This software is offered under the AGPL license.\n\nSee LICENSE.txt in your root install directory for details. See NOTICE.txt for information about open source software used in this system.\n\nThe following describes the automatic feature-enablement parameters of Uplink:'}
                    </p>
                    {`Name: ${license.Name}`}<br/>
                    {`Company or organization name: ${license.Company}`}<br/>
                    {`Edition: Uplink Fork`}<br/>
                    {`Number of users: ${license.Users}`}<br/>
                    {'License issued: '}{issued}<br/>
                    {'Start date of license: '}{startsAt}<br/>
                    {'Expiry date of license: '}{expiresAt}<br/>
                </div>
            );
        } else {
            licenseType = (
                <div>
                    {'Error: all features should automatically be enabled, but the feature enablement flag was not set, as if the automatic license was not configured correctly.'}
                </div>
            );
        }

        return (
            <div className='wrapper--fixed'>
                <FormattedAdminHeader
                    id='admin.license.title'
                    defaultMessage='Edition and License'
                />

                <div className='admin-console__wrapper'>
                    <div className='admin-console__content'>
                        <form
                            className='form-horizontal'
                            role='form'
                        >
                            <div className='form-group'>
                                <label
                                    className='control-label col-sm-4'
                                >
                                    <FormattedMessage
                                        id='admin.license.edition'
                                        defaultMessage='Edition: '
                                    />
                                </label>
                                <div className='col-sm-8'>
                                    {edition}
                                </div>
                            </div>
                            <div className='form-group'>
                                <label
                                    className='control-label col-sm-4'
                                >
                                    <FormattedMessage
                                        id='admin.license.type'
                                        defaultMessage='License: '
                                    />
                                </label>
                                <div className='col-sm-8'>
                                    {licenseType}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
