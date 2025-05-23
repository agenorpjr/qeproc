import { useEffect } from 'react';

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBasketCog,
  IconBasketSearch,
  IconBriefcase,
  IconCalendar,
  IconClipboardPlus,
  IconKeyFilled,
  IconLayoutDashboardFilled,
  IconListDetails,
  IconSearch,
  IconShoppingBagCheck,
  IconShoppingBagExclamation,
  IconThumbUp,
  IconUserPlus,
  IconX,
} from '@tabler/icons-react';

import { SidebarState } from '@/app/apps/layout';
import { Logo, UserProfileButton } from '@/components';
import { LinksGroup } from '@/components/Navigation/Admin/Links/Links';

import classes from '../Navigation.module.css';
import { useSession } from 'next-auth/react';

const mockdata = [
  {
    links: [
      { label: 'Dashboard', icon: IconLayoutDashboardFilled, link: '/admin/dashboard' },
      { label: 'Requisições para Aprovar', icon: IconShoppingBagExclamation, link: "/admin/approveorders"},
      { label: 'Requisições', icon: IconBasketSearch, link: "/admin/orders"},
      { label: 'Busca por Produto', icon: IconSearch, link: "/admin/searchbyprod"},
      { label: 'Novo Usuário', icon: IconUserPlus, link: "/sign-up" },
      { label: 'Gerenciar Compradores', icon: IconBriefcase, link: "/admin/purchaser" },
      { label: 'Gerenciar Aprovadores', icon: IconThumbUp, link: "/admin/approver" },
      { label: 'Trocar Senha', icon: IconKeyFilled, link: '/admin/settings' },
      { label: 'Minhas Requisições', icon: IconShoppingBagCheck, link: "/admin/myorders"},
      { label: 'Minhas Solicitações', icon: IconBasketCog, link: "/admin/drafts" },
      { label: 'Nova Solicitação', icon: IconClipboardPlus, link: "/admin/order" },

    ],
  }
];

type NavigationProps = {
  onClose: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: (state: SidebarState) => void;
};

const NavigationAdmin = ({
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

export default NavigationAdmin;
