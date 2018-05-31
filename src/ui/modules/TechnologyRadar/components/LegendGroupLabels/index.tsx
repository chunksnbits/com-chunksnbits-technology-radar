
// ----------------------------------------------------------------------------- Dependencies
import { Component, MouseEventHandler, ReactNode } from 'react';
import * as React from 'react';

import { classNames } from 'utils/dom';

import './styles.scss';
import { compose, consume } from 'utils/store';
import { TechnologyRadarContext, ApplicationStateContext } from 'store';

// ----------------------------------------------------------------------------- Configuration
export interface LegendGroupLabelsProps {
  className?: string;
  technologyRadar?: TechnologyRadarStore;
  applicationState?: ApplicationStateStore;
}

// SVG follows a different coordinate system.
// Thus add some static adjustment to labels to match them up with rendered items.
//
const SVG_ROTATION_SOURCE_ADJUSTMENT_DEGREES = -180;

// ----------------------------------------------------------------------------- Implementation
export class LegendGroupLabelsComponent extends Component<LegendGroupLabelsProps> {

  handlers: BoundHandlers<SVGElement> = {};

  // ----------------------------------------------------------------------------- Lifecycle methods
  render() {

    const modifiers = [];

    const { groups } = this.props.technologyRadar;

    if (!Boolean(groups)) {
      return null;
    }

    return (
      <div className={ classNames('c-legend-group-labels', this.props.className, ...modifiers) }>
        <svg viewBox='0 0 100 100' className='c-legend-group-labels__element'>
          <defs>
            <path d={ 'M0,50a50,50 0 1,0 100,0a50,50 0 1,0 -100,0' } fill='none' />
          </defs>

          <path d={ 'M0,50a50,50 0 1,0 100,0a50,50 0 1,0 -100,0' } id='c-legend-group-labels__text-path' fill='none' />

          <g
            className='c-legend-group-labels__group'
            style={{
              transform: `rotateZ(${ SVG_ROTATION_SOURCE_ADJUSTMENT_DEGREES + (360 / groups.length)  }deg)`
            }}>
            { this.renderLabels(groups) }
          </g>
        </svg>
      </div>
    );
  }

  // ----------------------------------------------------------------------------- Event hanndler methods
  bindSelectGroup(group: Group): MouseEventHandler<SVGTextElement> {
    const name = `select-group-${ group.id }`;

    if (!Boolean(this.handlers[name])) {
      this.handlers[name] = () => {
        this.props.applicationState.selectGroup(group);
      }
    }

    return this.handlers[name] as MouseEventHandler<SVGTextElement>;
  }

  // ----------------------------------------------------------------------------- Helpers methods
  private renderLabels(groups: Group[]): ReactNode {
    const baseAngleDegree = 360 / groups.length;
    const circumference = 2 * Math.PI * 50;
    const offset = circumference / groups.length;

    return groups.map((group, index) => {

      return (
        <text
          key={ group.id }
          className='c-legend-group-labels__label'
          style={{
            transform: [
              `rotateZ(${index * baseAngleDegree + 0.5 * baseAngleDegree}deg)`
            ].join(' ')
          }}
          onClick={ this.bindSelectGroup(group) }>
          <textPath
            alignmentBaseline='baseline'
            xlinkHref='#c-legend-group-labels__text-path'
            startOffset={ String(offset) }>
            { group.name }
          </textPath>
        </text>
      );
    });
  }
}

export const LegendGroupLabels = compose(
  consume(TechnologyRadarContext, { bindTo: 'technologyRadar' }),
  consume(ApplicationStateContext, { bindTo: 'applicationState' })
)(LegendGroupLabelsComponent);
