import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { useSetModal, useToastMessageDispatch, useRouteParameter, useRoute, useTranslation } from '@rocket.chat/ui-contexts';
import React, { ReactElement } from 'react';

import GenericModal from '../../../components/GenericModal';
import { useEndpointAction } from '../../../hooks/useEndpointAction';
import AgentInfo from './AgentInfo';

type AgentInfoActionProps = {
	reload: () => void;
};

const AgentInfoActions = ({ reload }: AgentInfoActionProps): ReactElement => {
	const t = useTranslation();
	const _id = useRouteParameter('id');
	const agentsRoute = useRoute('omnichannel-agents');
	const deleteAction = useEndpointAction('DELETE', `livechat/users/agent/${_id}`);
	const setModal = useSetModal();
	const dispatchToastMessage = useToastMessageDispatch();

	const handleRemoveClick = useMutableCallback(async () => {
		const result = await deleteAction();
		if (result.success === true) {
			agentsRoute.push({});
			reload();
		}
	});

	const handleDelete = useMutableCallback((e) => {
		e.stopPropagation();
		const onDeleteAgent = async (): Promise<void> => {
			try {
				await handleRemoveClick();
				dispatchToastMessage({ type: 'success', message: t('Agent_removed') });
			} catch (error) {
				dispatchToastMessage({ type: 'error', message: String(error) });
			}
			setModal();
		};

		setModal(
			<GenericModal
				variant='danger'
				onConfirm={onDeleteAgent}
				onCancel={(): void => setModal()}
				onClose={(): void => setModal()}
				confirmText={t('Delete')}
			/>,
		);
	});

	const handleEditClick = useMutableCallback(() =>
		agentsRoute.push({
			context: 'edit',
			id: _id || '',
		}),
	);

	return (
		<>
			<AgentInfo.Action key={t('Remove')} label={t('Remove')} onClick={handleDelete} icon={'trash'} />,
			<AgentInfo.Action key={t('Edit')} label={t('Edit')} onClick={handleEditClick} icon={'edit'} />,
		</>
	);
};

export default AgentInfoActions;