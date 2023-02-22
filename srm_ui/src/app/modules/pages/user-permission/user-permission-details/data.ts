

interface MainTabs {
    label: string;
}

interface SubTabs {
    label: string;
}

interface SubMenu {
    label?: string;
    value?: boolean;
    ctrlName?: string;
    level1?: SubMenu[];
}

interface MainMenuPermission {
    value: string;
    viewValue: string;
}

interface PagesPermission {
    value: string;
    viewValue: string;
}

interface MainTabsPermission {
    value: string;
    viewValue: string;
}

interface SubTabsPermission {
    value: string;
    viewValue: string;
}

interface SectionPermission {
    value: string;
    viewValue: string;
}

interface SubSectionPermission {
    value: string;
    viewValue: string;
}

interface SubMenuPermission {
    value: string;
    viewValue: string;
}

export {
    MainTabs,
    SubTabs,
    MainMenuPermission,
    SubMenuPermission,
    PagesPermission,
    MainTabsPermission,
    SubTabsPermission,
    SectionPermission,
    SubSectionPermission,
    SubMenu
};
