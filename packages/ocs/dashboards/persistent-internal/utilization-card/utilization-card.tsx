// TODO (@rexagod): https://github.com/openshift/console/pull/10470#discussion_r766453369
import * as React from 'react';
import { useODFSystemFlagsSelector } from '@odf/core/redux';
import ConsumerPopover from '@odf/shared/dashboards/utilization-card/ConsumerPopover';
import { PrometheusMultilineUtilizationItem } from '@odf/shared/dashboards/utilization-card/prometheus-multi-utilization-item';
import { PrometheusUtilizationItem } from '@odf/shared/dashboards/utilization-card/prometheus-utilization-item';
import { FieldLevelHelp } from '@odf/shared/generic/FieldLevelHelp';
import { useCustomTranslation } from '@odf/shared/useCustomTranslationHook';
import {
  humanizeBinaryBytes,
  humanizeDecimalBytesPerSec,
} from '@odf/shared/utils';
import { UtilizationDurationDropdown } from '@openshift-console/dynamic-plugin-sdk-internal';
import { ByteDataTypes } from '@openshift-console/dynamic-plugin-sdk/lib/api/internal-types';
import { useParams } from 'react-router-dom-v5-compat';
import {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  Grid,
} from '@patternfly/react-core';
import {
  StorageDashboardQuery,
  utilizationPopoverQueryMap,
  UTILIZATION_QUERY,
} from '../../../queries';
import { ODFSystemParams } from '../../../types';
import { humanizeIOPS, humanizeLatency } from './utils';
import '@odf/shared/dashboards/utilization-card/utilization-card.scss';

export const UtilizationContent: React.FC = () => {
  const { t } = useCustomTranslation();

  const { namespace: clusterNs } = useParams<ODFSystemParams>();
  const { systemFlags } = useODFSystemFlagsSelector();
  // name of the created StorageClasses are prefix by StorageCluster name,
  // it is also the value of the "managedBy" label in the metrics.
  const ocsCluster = systemFlags[clusterNs]?.ocsClusterName;

  const storagePopover = React.useCallback(
    ({ current }) => (
      <ConsumerPopover
        title={t('Used Capacity')}
        current={current}
        consumers={utilizationPopoverQueryMap(ocsCluster)}
        humanize={humanizeBinaryBytes}
      />
    ),
    [t, ocsCluster]
  );

  return (
    <Grid className="co-utilization-card__body">
      <PrometheusUtilizationItem
        title={t('Used capacity')}
        utilizationQuery={
          UTILIZATION_QUERY(ocsCluster, ocsCluster)[
            StorageDashboardQuery.CEPH_CAPACITY_USED
          ]
        }
        humanizeValue={humanizeBinaryBytes}
        byteDataType={ByteDataTypes.BinaryBytes}
        TopConsumerPopover={storagePopover}
      />
      <PrometheusMultilineUtilizationItem
        title={t('IOPS')}
        queries={[
          UTILIZATION_QUERY(ocsCluster)[
            StorageDashboardQuery.UTILIZATION_IOPS_READ_QUERY
          ],
          UTILIZATION_QUERY(ocsCluster)[
            StorageDashboardQuery.UTILIZATION_IOPS_WRITE_QUERY
          ],
        ]}
        humanizeValue={humanizeIOPS}
        chartType="stacked-area"
      />
      <PrometheusMultilineUtilizationItem
        title={t('Throughput')}
        queries={[
          UTILIZATION_QUERY(ocsCluster)[
            StorageDashboardQuery.UTILIZATION_THROUGHPUT_READ_QUERY
          ],
          UTILIZATION_QUERY(ocsCluster)[
            StorageDashboardQuery.UTILIZATION_THROUGHPUT_WRITE_QUERY
          ],
        ]}
        humanizeValue={humanizeDecimalBytesPerSec}
        chartType="stacked-area"
      />
      <PrometheusMultilineUtilizationItem
        title={t('Latency')}
        queries={[
          UTILIZATION_QUERY(ocsCluster)[
            StorageDashboardQuery.UTILIZATION_LATENCY_READ_QUERY
          ],
          UTILIZATION_QUERY(ocsCluster)[
            StorageDashboardQuery.UTILIZATION_LATENCY_WRITE_QUERY
          ],
        ]}
        humanizeValue={humanizeLatency}
        chartType="grouped-line"
      />
      <PrometheusUtilizationItem
        title={t('Recovery')}
        utilizationQuery={
          UTILIZATION_QUERY(ocsCluster)[
            StorageDashboardQuery.UTILIZATION_RECOVERY_RATE_QUERY
          ]
        }
        humanizeValue={humanizeDecimalBytesPerSec}
      />
    </Grid>
  );
};

const UtilizationCard: React.FC = () => {
  const { t } = useCustomTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('Utilization')}
          <FieldLevelHelp>
            {t(
              'Performance metrics over time showing IOPS, Latency and more. Each metric is a link to a detailed view of this metric.'
            )}
          </FieldLevelHelp>
        </CardTitle>
        <CardActions>
          <UtilizationDurationDropdown />
        </CardActions>
      </CardHeader>
      <UtilizationContent />
    </Card>
  );
};

export default UtilizationCard;
