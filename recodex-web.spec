%define name recodex-web
%define short_name web-app
%define version 1.0.0
%define unmangled_version 418315b23946956810749814c1ab5e0eebf37901
%define release 1

Summary: ReCodEx web-app component
Name: %{name}
Version: %{version}
Release: %{release}
License: MIT
Group: Development/Libraries
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-buildroot
Prefix: %{_prefix}
Vendor: Petr Stefan <UNKNOWN>
Url: https://github.com/ReCodEx/web-app
BuildRequires: systemd nodejs-packaging npm
Requires(post): systemd
Requires(preun): systemd
Requires(postun): systemd
AutoReq: no
AutoProv: no

#Source0: %{name}-%{unmangled_version}.tar.gz
Source0: https://github.com/ReCodEx/%{short_name}/archive/%{unmangled_version}.tar.gz#/%{short_name}-%{unmangled_version}.tar.gz

%define debug_package %{nil}

%description
Web-app of ReCodEx programmer testing solution.

%prep
%setup -n %{short_name}-%{unmangled_version}


%build
rm -f .gitignore
rm -rf node_modules
cat <<__EOF > .env
NODE_ENV=production
API_BASE=https://recodex.projekty.ms.mff.cuni.cz:4040/v1
PORT=8080
__EOF
npm -q install
npm run build

%install
install -d  %{buildroot}%{nodejs_sitelib}/%{name}
cp -r ./bin %{buildroot}%{nodejs_sitelib}/%{name}/bin
cp -r ./public %{buildroot}%{nodejs_sitelib}/%{name}/public
cp -r ./node_modules %{buildroot}%{nodejs_sitelib}/%{name}/node_modules
cp -r ./views %{buildroot}%{nodejs_sitelib}/%{name}/views
install -d %{buildroot}/lib/systemd/system
cp -r install/recodex-web.service %{buildroot}/lib/systemd/system/recodex-web.service

%clean


%post
%systemd_post 'recodex-web.service'

%postun
%systemd_postun_with_restart 'recodex-web.service'

%pre
getent group recodex >/dev/null || groupadd -r recodex
getent passwd recodex >/dev/null || useradd -r -g recodex -d %{_sysconfdir}/recodex -s /sbin/nologin -c "ReCodEx Code Examiner" recodex
exit 0

%preun
%systemd_preun 'recodex-web.service'

%files
%defattr(-,root,root)
#%dir %attr(-,recodex,recodex) %{_sysconfdir}/recodex/worker
%dir %attr(-, recodex,recodex) %{nodejs_sitelib}/%{name}

%{nodejs_sitelib}/%{name}/bin/*.jpg
%{nodejs_sitelib}/%{name}/bin/dev.js
%{nodejs_sitelib}/%{name}/bin/server.js
%{nodejs_sitelib}/%{name}/bin/manageTranslations.js
%{nodejs_sitelib}/%{name}/public/
%{nodejs_sitelib}/%{name}/node_modules/
%{nodejs_sitelib}/%{name}/views/

#%config(noreplace) %attr(-,recodex,recodex) %{_sysconfdir}/recodex/worker/config-1.yml
#%{_unitdir}/recodex-web.service
/lib/systemd/system/recodex-web.service

%changelog

