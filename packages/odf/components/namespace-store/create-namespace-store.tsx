import * as React from 'react';
import { CEPH_STORAGE_NAMESPACE } from '@odf/shared/constants';
import { getName } from '@odf/shared/selectors';
import { useCustomTranslation } from '@odf/shared/useCustomTranslationHook';
import { referenceForModel } from '@odf/shared/utils';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';
import { Title } from '@patternfly/react-core';
import { NooBaaNamespaceStoreModel } from '../../models';
import NamespaceStoreForm from './namespace-store-form';
import '../mcg-endpoints/noobaa-provider-endpoints.scss';
import '../../style.scss';

const CreateNamespaceStore: React.FC<{}> = () => {
  const { t } = useCustomTranslation();
  const { ns = CEPH_STORAGE_NAMESPACE } = useParams();

  const navigate = useNavigate();
  const onCancel = () => navigate(-1);

  return (
    <>
      <div className="odf-create-operand__header">
        <Title
          size="2xl"
          headingLevel="h1"
          className="odf-create-operand__header-text"
        >
          {t('Create NamespaceStore ')}
        </Title>
        <p className="help-block">
          {t(
            'Represents an underlying storage to be used as read or write target for the data in the namespace buckets.'
          )}
        </p>
      </div>
      <NamespaceStoreForm
        onCancel={onCancel}
        redirectHandler={(resources) => {
          const lastIndex = resources.length - 1;
          const resourcePath = `${referenceForModel(
            NooBaaNamespaceStoreModel
          )}/${getName(resources[lastIndex])}`;
          navigate(`/odf/resource/${resourcePath}`);
        }}
        namespace={ns}
        className="nb-endpoints-page-form__short"
      />
    </>
  );
};

export default CreateNamespaceStore;
