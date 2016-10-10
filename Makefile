TESTS = $(shell find test -type f -name "*.js")

test:
	npm i && ./node_modules/.bin/mocha \
		$(TESTS)


.PHONY: test