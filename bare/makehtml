#!/usr/bin/python2.7
import os

def main():
    header = open('header.html').read()
    footer = open('footer.html').read()

    pages = [f for f in os.listdir('pages') if f.endswith('.html')]

    for p in pages:
        page = open(os.path.join('pages',p)).read()

        f = open(p,'w')
        f.write(header)
        f.write(page)
        f.write(footer)
        f.close()

if __name__ == "__main__":
    main()
