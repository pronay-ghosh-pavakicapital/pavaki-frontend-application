import Images from "../utils/images";

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

interface UseImagesReturn {
    getImage: (imageKey: keyof Omit<AppImages, 'addWhite'>) => string;
}

export function useImages(): UseImagesReturn {
    return {
        getImage: (imageKey: keyof Omit<AppImages, 'addWhite'>) => {
            return Images.getImagePath(Images.appImages[imageKey]);
        },
    };
}