interface AppImages {
    addWhite: string;
    appLogo: string;
    appleLogo: string;
    blackAdd: string;
    cross: string;
    blueDownArrow: string;
    downloadLogo: string;
    expandLogo: string;
    filterBlack: string;
    filterBlue: string;
    googleIcon: string;
    minimize: string;
    profileIcon: string;
    searchBlack: string;
    searchBlue: string;
    send: string;
    upload: string;
    whiteFilter: string;
}

interface ImagesType {
    basePath: string;
    appImages: AppImages;
    getImagePath: (imagePath: string) => string;
}

const Images: ImagesType = {
    // Base path
    basePath: '/assets',
    
    // App Images
    appImages : {
        addWhite: '/add_white.svg',
        appleLogo: '/apple.svg',
        appLogo: '/app_logo.svg',
        blackAdd: '/black_add.svg',
        cross: '/cross.svg',
        downloadLogo: '/download.svg',
        blueDownArrow: '/down_blue.svg',
        expandLogo: '/expand.svg',
        filterBlack: '/filter_black.svg',
        filterBlue: '/filter_blue.svg',
        googleIcon: '/google.svg',
        minimize: '/minimize.svg',
        profileIcon: '/profile.svg',
        searchBlack: '/search_black.svg',
        searchBlue: '/search_blue.svg',
        upload: '/upload.svg',
        whiteFilter: '/white_filter.svg',
        send: '/send.svg',
    },

    // Helper function to get the full path
    getImagePath: function (imagePath: string): string {
        return `${this.basePath}${imagePath}`;
    },
}

export default Images;