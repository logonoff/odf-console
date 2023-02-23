import * as React from 'react';
import { RedExclamationCircleIcon } from '@odf/shared/status/icons';
import StatusIconAndText from '@odf/shared/status/StatusIconAndText';
import { useCustomTranslation } from '@odf/shared/useCustomTranslationHook';
import { getAlertSeverity } from '@odf/shared/utils';
import {
  Alert,
  AlertSeverity,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  AlertItem,
  AlertsBody,
} from '@openshift-console/dynamic-plugin-sdk-internal';
import { Alert as InternalAlert } from '@openshift-console/dynamic-plugin-sdk-internal/lib/api/common-types';
import classNames from 'classnames';
import * as _ from 'lodash-es';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Badge,
  Title,
} from '@patternfly/react-core';
import { Divider } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import './alerts.scss';

type AlertBadgeProps = {
  alerts: Alert[];
  alertSeverity: AlertSeverity;
  key?: number;
};

const AlertBadge: React.FC<AlertBadgeProps> = ({
  alerts,
  alertSeverity,
  key,
}) => {
  let icon: JSX.Element;
  switch (alertSeverity) {
    case AlertSeverity.Critical:
      icon = <RedExclamationCircleIcon />;
      break;
    case AlertSeverity.Warning:
      icon = <YellowExclamationTriangleIcon />;
      break;
    default:
      icon = <InfoCircleIcon />;
  }
  return (
    <>
      <Badge
        key={key}
        className={`odf-alerts-panel__badge odf-alerts-panel__badge-${alertSeverity}`}
      >
        <StatusIconAndText title={alerts.length.toString()} icon={icon} />
      </Badge>
      <span className="odf-alerts-panel__badge-text">
        {_.startCase(alertSeverity)}
      </span>
    </>
  );
};

type AlertAccordionItemProps = {
  alerts: Alert[];
  alertSeverity: AlertSeverity;
  expanded: string;
  loaded: boolean;
  loadError: object;
  onToggle: Function;
};

const AlertAccordionItem: React.FC<AlertAccordionItemProps> = ({
  alerts,
  alertSeverity,
  expanded,
  loaded,
  loadError,
  onToggle,
}) => {
  const alertToggleId = `alert-toggle-${alertSeverity}`;
  const alertExpandId = `alert-expand-${alertSeverity}`;
  return (
    <AccordionItem>
      <AccordionToggle
        onClick={() => onToggle(alertToggleId)}
        isExpanded={expanded === alertToggleId}
        id={alertToggleId}
      >
        {`${_.startCase(alertSeverity)} alerts ${alerts.length}`}
      </AccordionToggle>
      <AccordionContent
        id={alertExpandId}
        isHidden={expanded !== alertToggleId}
      >
        <AlertsBody error={!_.isEmpty(loadError)}>
          {loaded &&
            alerts.length > 0 &&
            alerts.map((alert) => (
              <AlertItem
                key={alert?.rule?.id}
                alert={alert as unknown as InternalAlert}
              />
            ))}
        </AlertsBody>
      </AccordionContent>
    </AccordionItem>
  );
};

type AlertsProps = {
  alerts: Alert[];
  alertsFilter?: (alert: Alert) => boolean;
  className?: string;
  loaded: boolean;
  loadError: object;
};

const AlertsPanel: React.FC<AlertsProps> = ({
  alerts,
  alertsFilter,
  className,
  loaded,
  loadError,
}) => {
  const { t } = useCustomTranslation();
  const [expanded, setExpanded] = React.useState('');
  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };
  const filteredAlerts =
    loaded && !loadError && !_.isEmpty(alerts)
      ? alertsFilter
        ? alerts.filter(alertsFilter)
        : alerts
      : [];
  const [criticalAlerts, warningAlerts, infoAlerts] = [[], [], []];
  filteredAlerts.forEach((alert: Alert) => {
    switch (getAlertSeverity(alert)) {
      case AlertSeverity.Critical:
        criticalAlerts.push(alert);
        break;
      case AlertSeverity.Warning:
        warningAlerts.push(alert);
        break;
      default:
        infoAlerts.push(alert);
    }
  });

  return (
    <div
      className={classNames('odf-m-pane__body', 'odf-alerts__panel', className)}
    >
      <Title headingLevel="h3">
        {t('Alerts')} ({filteredAlerts.length})
      </Title>
      <>
        <Divider className="odf-alerts-panel__divider" />
        <AlertBadge
          alerts={criticalAlerts}
          alertSeverity={AlertSeverity.Critical}
        />
        <AlertBadge
          alerts={warningAlerts}
          alertSeverity={AlertSeverity.Warning}
        />
        <AlertBadge alerts={infoAlerts} alertSeverity={AlertSeverity.Info} />
        <Divider className="odf-alerts-panel__divider" />
        <Accordion asDefinitionList={false}>
          <AlertAccordionItem
            alerts={criticalAlerts}
            alertSeverity={AlertSeverity.Critical}
            onToggle={onToggle}
            expanded={expanded}
            loaded={loaded}
            loadError={loadError}
          />
          <AlertAccordionItem
            alerts={warningAlerts}
            alertSeverity={AlertSeverity.Warning}
            onToggle={onToggle}
            expanded={expanded}
            loaded={loaded}
            loadError={loadError}
          />
          <AlertAccordionItem
            alerts={infoAlerts}
            alertSeverity={AlertSeverity.Info}
            onToggle={onToggle}
            expanded={expanded}
            loaded={loaded}
            loadError={loadError}
          />
        </Accordion>
      </>
    </div>
  );
};

export default AlertsPanel;