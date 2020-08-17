// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import {ChannelCategory} from 'mattermost-redux/types/channel_categories';

import {trackEvent} from 'actions/diagnostics_actions';
import QuickInput from 'components/quick_input';
import {localizeMessage} from 'utils/utils';

import '../category_modal.scss';

type Props = {
    onHide: () => void;
    currentTeamId: string;
    categoryId?: string;
    initialCategoryName?: string;
    channelIdsToAdd?: string[];
    actions: {
        createCategory: (teamId: string, displayName: string, channelIds?: string[] | undefined) => {data: ChannelCategory};
        renameCategory: (categoryId: string, newName: string) => void;
    };
};

type State = {
    categoryName: string;
    show: boolean;
}

export default class EditCategoryModal extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            categoryName: props.initialCategoryName || '',
            show: true,
        };
    }

    handleClear = () => {
        this.setState({categoryName: ''});
    }

    handleChange = (e: any) => {
        this.setState({categoryName: e.target.value});
    }

    handleCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        this.handleClear();
        this.onHide();
    }

    handleConfirm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (this.props.categoryId) {
            this.props.actions.renameCategory(this.props.categoryId, this.state.categoryName);
        } else {
            this.props.actions.createCategory(this.props.currentTeamId, this.state.categoryName, this.props.channelIdsToAdd);
            trackEvent('ui', 'ui_sidebar_created_category');
        }

        this.onHide();
    }

    onHide = () => {
        this.setState({show: false}, this.props.onHide);
    }

    getText = () => {
        let modalHeaderText = (
            <FormattedMessage
                id='create_category_modal.createCategory'
                defaultMessage='Create Category'
            />
        );
        let editButtonText = (
            <FormattedMessage
                id='create_category_modal.create'
                defaultMessage='Create'
            />
        );

        if (this.props.categoryId) {
            modalHeaderText = (
                <FormattedMessage
                    id='rename_category_modal.renameCategory'
                    defaultMessage='Rename Category'
                />
            );
            editButtonText = (
                <FormattedMessage
                    id='rename_category_modal.rename'
                    defaultMessage='Rename'
                />
            );
        }

        return {modalHeaderText, editButtonText};
    }

    render() {
        const {modalHeaderText, editButtonText} = this.getText();

        return (
            <Modal
                dialogClassName='a11y__modal edit-category'
                show={this.state.show}
                onHide={this.onHide}
                onExited={this.onHide}
                enforceFocus={true}
                restoreFocus={true}
                role='dialog'
                aria-labelledby='editCategoryModalLabel'
            >
                <Modal.Header
                    closeButton={true}
                />
                <form>
                    <Modal.Body>
                        <div className='edit-category__header'>
                            <h1 id='editCategoryModalLabel'>
                                {modalHeaderText}
                            </h1>
                        </div>
                        <div className='edit-category__body'>
                            <QuickInput
                                autoFocus={true}
                                className='form-control filter-textbox'
                                type='text'
                                value={this.state.categoryName}
                                placeholder={localizeMessage('edit_category_modal.placeholder', 'Choose a category name')}
                                clearable={true}
                                onClear={this.handleClear}
                                onChange={this.handleChange}
                                maxLength={22}
                            />
                            <span className='edit-category__helpText'>
                                <FormattedMessage
                                    id='edit_category_modal.helpText'
                                    defaultMessage='You can drag channels into categories to organize your sidebar.'
                                />
                            </span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type='button'
                            className='edit_category__button cancel'
                            onClick={this.handleCancel}
                        >
                            <FormattedMessage
                                id='edit_category_modal.cancel'
                                defaultMessage='Cancel'
                            />
                        </button>
                        <button
                            type='submit'
                            className={classNames('edit_category__button create', {
                                disabled: !this.state.categoryName || (Boolean(this.props.initialCategoryName) && this.props.initialCategoryName === this.state.categoryName),
                            })}
                            onClick={this.handleConfirm}
                            disabled={!this.state.categoryName || (Boolean(this.props.initialCategoryName) && this.props.initialCategoryName === this.state.categoryName)}
                        >
                            {editButtonText}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}
