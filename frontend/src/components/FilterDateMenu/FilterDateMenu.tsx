import { Button, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

const FilterDateMenu = () => {
  const datadehj = new Date(Date.now()).toLocaleString('pt-BR').split(',')[0]
  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <Button variant="primary" >
          Hoje: {datadehj}
        </Button>
      </Menu.Target>

      {/* <Menu.Dropdown>
        <Menu.Item>Today</Menu.Item>
        <Menu.Item>Yesterday</Menu.Item>
        <Menu.Item>Last 7 days</Menu.Item>
        <Menu.Item>Last 30 days</Menu.Item>
        <Menu.Item>This month</Menu.Item>
        <Menu.Item>Last month</Menu.Item>
      </Menu.Dropdown> */}
    </Menu>
  );
};

export default FilterDateMenu;
