.PHONY: dev-cz prod-cz

dev-cz:
	@NGINX_CONF=dev-cz.conf docker-compose up

prod-cz:
	@NGINX_CONF=prod-cz.conf docker-compose up