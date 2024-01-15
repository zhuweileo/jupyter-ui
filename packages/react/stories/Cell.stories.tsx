/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Jupyter, Cell } from './../src';

const meta: Meta<typeof Cell> = {
  title: 'Components/Cell',
  component: Cell,
  argTypes: {
    browser: {
      control: 'radio',
      options: ['true', 'false', '@jupyterlite/javascript-kernel-extension'],
      table: {
        // Switching live does not work
        disable: true,
      },
    },
    source: {
      control: 'text',
    },
    autoStart: {
      control: 'boolean',
    },
  },
} as Meta<typeof Cell>;

export default meta;

type Story = StoryObj<typeof Cell | typeof Jupyter | { browser: string }>;

const Template = (args, { globals: { labComparison } }) => {
  const { browser, ...others } = args;
  const lite = {
    true: true,
    false: false,
    '@jupyterlite/javascript-kernel-extension': import(
      '@jupyterlite/javascript-kernel-extension'
    ),
  }[args.browser];

  const kernelName =
    args.browser === '@jupyterlite/javascript-kernel-extension'
      ? 'javascript'
      : undefined;

  return (
    <Jupyter
      lite={lite}
      defaultKernelName={kernelName}
      jupyterServerHttpUrl="https://oss.datalayer.tech/api/jupyter"
      jupyterServerWsUrl="wss://oss.datalayer.tech/api/jupyter"
      jupyterToken="60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
    >
      <Cell {...others} />
    </Jupyter>
  );
};

export const Default: Story = Template.bind({});
Default.args = {
  browser: 'false',
  source: '',
  autoStart: false,
};

export const Playground: Story = {
  render: Template.bind({}),
};

Playground.args = {
  ...Default.args,
  source: `import numpy as np
import matplotlib.pyplot as plt
x1 = np.linspace(0.0, 5.0)
x2 = np.linspace(0.0, 2.0)
y1 = np.cos(2 * np.pi * x1) * np.exp(-x1)
y2 = np.cos(2 * np.pi * x2)
fig, (ax1, ax2) = plt.subplots(2, 1)
fig.suptitle('A tale of 2 subplots')
ax1.plot(x1, y1, 'o-')
ax1.set_ylabel('Damped oscillation')
ax2.plot(x2, y2, '.-')
ax2.set_xlabel('time (s)')
ax2.set_ylabel('Undamped')
plt.show()`,
  autoStart: true,
};

export const LitePython: Story = Template.bind({});
LitePython.args = {
  ...Playground.args,
  browser: 'true',
  source: `import sys
print(f"{sys.platform=}")

${Playground.args.source ?? ''}`,
};
