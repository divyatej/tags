let countryCodesList='ar,au,at,be,br,ca,cl,cn,fj,fi,fr,pf,de,gl,hk,in,id,ie,it,jp,kr,mx,nl,nc,nz,na,pg,ph,sg,za,sa,es,ch,tw,th,ae,gb,us,vu,vn';
let businessUnitCodesList='qd,re,ql,rp,pro,dg,sbu,qs,eq,cs,fs,pt,om,aq,gc,rs,mv,gcc,gcp,as,ff,ccr,acc';
let agencyCodesList='omd,in,15b,blue449,zenith opti media,perfomics,iclick,mindshare,maxus,int';
let channelCodesList='edm,sem,dis,os,ps,pr,prs,bb,tv,rd,ol,af,cm';
let languagesList='en,zh_CN,zh_TW,ja,de,fr,es';
let productsList='flights,cars,hotels,baggage,seats,transfers,activities,insurance,manage-your-trip,qantas-store,epiqure,cash,financial-services,points,online-mall,aquire,golf-club,restaurants,movies,gift-cards-cash,gift-cards-points,assure,frequent-flyer';
let placementList='fb,tw,gg,bi,yh,yt,gdn,li,inst,etr,pdc,ff';
module.exports={
    getCountryCodeList:function(){
        return countryCodesList;
    },
    getBusinessUnitCodeList:function(){
        return businessUnitCodesList;
    },
    getAgencyCodeList:function(){
        return agencyCodesList;
    },
    getChannelCodeList:function(){
        return channelCodesList;
    },
    getLanguageCodeList:function(){
        return languagesList;
    },
    getProductCodeList:function(){
        return productsList;
    },
    getPlacementList:function(){
        return placementList;
    }
}