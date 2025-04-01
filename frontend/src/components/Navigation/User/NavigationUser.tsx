import { useEffect } from 'react';

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCalendar,
  IconClipboardPlus,
  IconFolderQuestion,
  IconFoldersFilled,
  IconLayoutDashboardFilled,
  IconListDetails,
  IconUserCode,
  IconX,
} from '@tabler/icons-react';

import { SidebarState } from '@/app/apps/layout';
import { Logo, UserProfileButton } from '@/components';
import { LinksGroup } from '@/components/Navigation/User/Links/Links';

import classes from '../Navigation.module.css';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const mockdata = [
  {
    links: [
      { label: 'Dashboard', icon: IconLayoutDashboardFilled, link: '/user/dashboard' },
      { label: 'Minhas Requisições', icon: IconFoldersFilled, link: "/user/orders"},
      { label: 'Minhas Solicitações', icon: IconFolderQuestion, link: "/user/drafts" },
      { label: 'Nova Solicitação', icon: IconClipboardPlus, link: "/user/order" },
      { label: 'Configurações', icon: IconUserCode, link: '/user/settings' },
      { label: 'Tasks', icon: IconListDetails, link: '/user' },
      { label: 'Calendar', icon: IconCalendar, link: '/user' },
    ],
  }
];

type NavigationProps = {
  onClose: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: (state: SidebarState) => void;
};

const NavigationUser = ({
  onClose,
  onSidebarStateChange,
  sidebarState,
}: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const { data: session } = useSession()

  const links = mockdata.map((m) => (
    <Box key={m.title} pl={0} mb={sidebarState === 'mini' ? 0 : 'md'}>
      {sidebarState !== 'mini' && (
        <Text
          tt="uppercase"
          size="xs"
          pl="md"
          fw={500}
          mb="sm"
          className={classes.linkHeader}
        >
          {m.title}
        </Text>
      )}
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          isMini={sidebarState === 'mini'}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  useEffect(() => {
    if (tablet_match) {
      onSidebarStateChange('full');
    }
  }, [onSidebarStateChange, tablet_match]);

  return (
    <div className={classes.navbar} data-sidebar-state={sidebarState}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify={sidebarState === 'mini' ? 'center' : 'space-between'}
            style={{ flex: tablet_match ? 'auto' : 1 }}
          >
            <Logo className={classes.logo} showText={sidebarState !== 'mini'} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner} data-sidebar-state={sidebarState}>
          {links}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserProfileButton
          email={session?.user?.email}
          image={""}
          name={session?.user?.name}
          showText={sidebarState !== 'mini'}
        />
      </div>
    </div>
  );
};

export default NavigationUser;
