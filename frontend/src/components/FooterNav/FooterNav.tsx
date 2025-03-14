import {
  ActionIcon,
  Button,
  ButtonProps,
  Group,
  Menu,
  Text,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDots } from '@tabler/icons-react';

import { PATH_GITHUB } from '@/routes';

const FooterNav = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const mobile_match = useMediaQuery('(max-width: 425px)');

  const BUTTON_PROPS: ButtonProps = {
    variant: 'subtle',
    style: {
      padding: `${rem(8)} ${rem(12)}`,
      color: colorScheme === 'dark' ? theme.white : theme.black,

      '&:hover': {
        transition: 'all ease 150ms',
        backgroundColor:
          colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
        textDecoration: 'none',
      },
    },
  };

  return (
    <Group justify="space-between">
      {mobile_match ? (
        <Menu shadow="md" width={200} position="right-end">
          <Menu.Target>
            <ActionIcon>
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>Suporte</Menu.Item>
            <Menu.Item>Ajuda</Menu.Item>
            <Menu.Item>Privacidade</Menu.Item>
            <Menu.Item>Termos de Uso</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Group gap={4}>
          <Button {...BUTTON_PROPS}>Suporte</Button>
          <Button {...BUTTON_PROPS}>Ajuda</Button>
          <Button {...BUTTON_PROPS}>Privacidade</Button>
          <Button {...BUTTON_PROPS}>Termos de Uso</Button>
        </Group>
      )}
      <Text
        c="dimmed"
        fz="sm"
        component="a"
        href={PATH_GITHUB.org}
        target="_blank"
      >
        &copy;&nbsp;{new Date().getFullYear()}&nbsp;Agenor Corp
      </Text>
    </Group>
  );
};

export default FooterNav;
