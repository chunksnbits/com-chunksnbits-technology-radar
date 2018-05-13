
// ----------------------------------------------------------------------------- Dependencies
import { Component, ReactNode } from 'react';
import * as React from 'react';

import { classNames } from 'utils/dom';

import './styles.scss';

// ----------------------------------------------------------------------------- Configuration
export interface LegendProps {
  className?: string;
  technologies: Technology[];
  groups: Group[];
  settings: TechnologyRadarSettings;
  onSelectGroup: (group: Group) => any;
}

// ----------------------------------------------------------------------------- Implementation
export class Legend extends Component<LegendProps> {

  // ----------------------------------------------------------------------------- Event handler methods
  propagateSelectGroup: (group: Group) => () => void = (group: Group) => {
    return () => {
      this.props.onSelectGroup(group);
    };
  }

  // ----------------------------------------------------------------------------- Lifecycle methods
  render() {
    const modifiers = [];

    return (
      <div className={ classNames('c-legend', this.props.className, ...modifiers) }>
        <div className='c-legend__labels'>
          <svg viewBox='0 0 100 100'>
            <defs>
              <path d={ 'M0,50a50,50 0 1,0 100,0a50,50 0 1,0 -100,0' } id='c-legend__text-path' fill='none' />
            </defs>

            { this.renderLabels(this.props.groups) }
          </svg>
        </div>

        <div className='c-legend__groups'>
          { this.renderGroups(this.props.groups) }
        </div>

        <div className='c-legend__levels'>
          { this.renderLevels(this.props.technologies, this.props.settings) }
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------- Helpers methods
  private renderLabels(groups: Group[]) {
    const baseAngleDegree = 360 / groups.length;
    const circumference = 2 * Math.PI * 50;
    const offset = circumference / groups.length;

    return groups.map((group, index) => {

      return (
        <text key={group.id}
          className='c-legend__label'
          style={{
            transform: `rotateZ(${index * baseAngleDegree + 0.5 * baseAngleDegree}deg)`
          }}
          onClick={ this.propagateSelectGroup(group) }>
          <textPath
            alignmentBaseline='text-after-edge'
            xlinkHref='#c-legend__text-path'
            startOffset={ String(offset) }>
            { group.name }
          </textPath>
        </text>
      );
    });
  }

  private renderLevels(technologies: Technology[], settings: TechnologyRadarSettings): ReactNode {
    const maxLevel = this.getMaxLevel(technologies);
    const step = 2 * (settings.outerRadiusPercent - settings.innerRadiusPercent) / maxLevel;

    return new Array(maxLevel).fill(null).map((_, index) => {
      const level = index + 1;
      const size = 2 * settings.innerRadiusPercent + level * step;

      return (
        <div key={index}
          className='c-legend__level'
          style={{
            height: `${size}vmin`,
            width: `${size}vmin`,
          }} />
      );
    });
  }

  private renderGroups(groups: Group[]) {
    const baseAngleDegree = 360 / groups.length;

    return groups.map((group, index) => {
      return (
        <h4 key={index}
          className='c-legend__group'
          style={{
            transform: [
              'translateX(25vmin)',
              `rotateZ(${ index * baseAngleDegree }deg)`
            ].join(' ')
          }} />
      )
    });
  }

  private getMaxLevel(technologies: Technology[]): number {
    return technologies.reduce((result, technology) => Math.max(result, technology.level), 0);
  }
}
